// @flow
import Spider from "./Spider.js";
import { dcEmitter } from "./monitor/DeclarativeCrawlerEmitter";
import SpiderMessage from "./monitor/entity/SpiderMessage";

export type RequestType = {
  // 请求地址
  url: string,

  // fetch 使用的配置
  option: { [string]: any }
};

export type SpiderTask = {
  // 当前执行任务的蜘蛛实例
  spiderInstance: Spider,

  // 当前爬虫的请求配置
  request: RequestType,

  // 当前蜘蛛对应的转换
  transformer?: Function,

  // 当前蜘蛛对应的下一个蜘蛛
  nextSpiderInstance?: Spider
};

export default class Crawler {
  // 当前类名
  name = this.constructor.name;

  // 用于前端的展示名
  displayName = "Crawler";

  // 存放所有的爬虫信息
  spiders: Array<Spider> = [];

  transforms: Array<Function> = [];

  requests: RequestType = [];

  // 标志位，记录当前爬虫是否正在允许
  isRunning: boolean = false;

  // 标志位，记录当前爬虫是否被初始化
  get _isInitialized(): boolean {
    return !!this.spiders && !!this.transforms && !!this.requests;
  }

  initialize() {}

  /**
   * @function 待复写函数，设置当前的待处理的 URL 或者 Generator
   * @returns {Array}
   */
  setRequests(requests) {
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

  transform(transformer: Function): Crawler {
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

    let spiderTasks = this.requests.map(request => {
      return {
        spiderInstance: this.spiders[0],
        request,
        transformer: this.transforms.length > 0 ? this.transforms[0] : null,
        nextSpiderInstance: this.spiders.length > 1 ? this.spiders[1] : null
      };
    });

    this.isRunning = true;

    while (spiderTasks.length > 0) {
      // 取出某个任务实例
      let spiderTask = spiderTasks.shift();

      // 设置爬虫的请求
      spiderTask.spiderInstance.setRequest(spiderTask.request.url);

      let startTime = new Date();

      // 执行当前任务
      let data = await spiderTask.spiderInstance.run(isPersist);

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
          spiderTasks.push({
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
