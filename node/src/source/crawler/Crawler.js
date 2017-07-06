// @flow
import Spider from "../spider/Spider.js";
import SpiderMessage from "./store/entity/SpiderMessage";
import { dcEmitter } from "./supervisor";

export type Transformer = (dataFromPreviousSpider: any) => {};

export type SpiderTask = {
  // 当前执行任务的蜘蛛实例
  spiderInstance: Spider,

  // 当前爬虫的请求配置
  request: RequestType,

  // 当前蜘蛛对应的转换
  transformer?: Transformer,

  // 当前蜘蛛对应的下一个蜘蛛
  nextSpiderInstance?: Spider
};

/**
 * Description 当前爬虫实例
 */
export default class Crawler {
  // 当前类名
  name = this.constructor.name;

  // 用于前端的展示名
  displayName = "Crawler";

  // 存放所有的爬虫信息
  spiders: Array<Spider> = [];

  transforms: Array<Transformer> = [];

  // 初始请求列表
  requests: Array<RequestType> = [];

  // 所有请求的历史记录

  // 标志位，记录当前爬虫是否正在允许
  isRunning: boolean = false;

  // 存放内部的所有蜘蛛任务
  _spiderTasks: [SpiderTask] = [];

  // 标志位，记录当前爬虫是否被初始化
  get _isInitialized(): boolean {
    return (
      !!this.spiders.length &&
      !!this.transforms.length &&
      !!this.requests.length
    );
  }

  initialize() {}

  /**
   * @function 待复写函数，设置当前的待处理的 URL 或者 Generator
   * @returns {Array}
   */
  setRequests(requests: [RequestType]) {
    if (!Array.isArray(requests) || requests.length === 0) {
      throw new Error("请输入请求目标数组");
    }

    if (!requests[0].url) {
      throw new Error("请输入有效的请求类型：RequestType");
    }

    requests && (this.requests = requests);

    return this;
  }

  /**
   * @function 添加蜘蛛到当前爬虫流中
   * @param spider
   * @returns {Crawler}
   */
  setSpider(spider: Spider): Crawler {
    // 将蜘蛛所属爬虫设置为当前爬虫
    spider.setCrawler(this);

    this.spiders.push(spider);

    return this;
  }

  /**
   * @function 添加转换函数
   * @param transformer
   * @returns {Crawler}
   */
  transform(transformer: Transformer): Crawler {
    this.transforms.push(transformer);
    return this;
  }

  /**
   * @function 重置当前爬虫状态
   */
  reset() {
    this.initialize();
    this.isRunning = false;
  }

  /**
   * @function 执行单个爬虫
   */
  async run(isPersist: boolean): Promise<boolean> {
    // 判断是否已经初始化
    if (!this._isInitialized) {
      // 初始化构造
      this.initialize();
    }

    if (this.spiders.length === 0 || this.requests.length === 0) {
      throw new Error("请至少设置一个爬虫实例与一个请求！");
    }

    this._spiderTasks = this.requests.map(request => {
      return {
        spiderInstance: this.spiders[0],
        request,
        transformer: this.transforms.length > 0 ? this.transforms[0] : null,
        nextSpiderInstance: this.spiders.length > 1 ? this.spiders[1] : null
      };
    });

    this.isRunning = true;

    while (this._spiderTasks.length > 0) {
      // 取出某个任务实例
      let spiderTask:SpiderTask = this._spiderTasks.shift();

      // 设置爬虫的请求
      spiderTask.spiderInstance.setRequest(
        spiderTask.request.url,
        spiderTask.request.option
      );

      // 判断上一次发出的请求中是否附带有额外的 extra 信息
      if (spiderTask.request.extra) {
        spiderTask.spiderInstance.setExtra(spiderTask.request.extra);
      }

      let startTime = new Date();

      // 执行当前任务
      let data = await spiderTask.spiderInstance.run(isPersist);

      // 反馈爬虫执行时间信息
      dcEmitter.emit(
        "Spider",
        new SpiderMessage(
          SpiderMessage.LOG_EXECUTE_DURATION,
          spiderTask.spiderInstance,
          new Date() - startTime
        )
      );

      // 设置新的爬虫
      if (spiderTask.transformer && spiderTask.nextSpiderInstance) {
        // 根据转换器获取新的请求
        let newRequests = spiderTask.transformer(data);

        // 获取下一个爬虫实例的下标
        let index = this.spiders.indexOf(spiderTask.nextSpiderInstance);

        // 根据获取到的新请求来创建新的爬虫任务
        for (let request of newRequests) {
          // 判断 request 是字符串还是 URL
          if (typeof request === "string") {
            request = {
              url: request
            };
          }

          this._spiderTasks.push({
            spiderInstance: spiderTask.nextSpiderInstance,
            request,
            transformer: this.transforms.length > index
              ? this.transforms[index]
              : null,
            nextSpiderInstance: this.spiders.length > index + 1
              ? this.spiders[index + 1]
              : null
          });
        }
      }
    }

    this.isRunning = false;

    return true;
  }
}
