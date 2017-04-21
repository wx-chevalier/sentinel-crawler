// @flow
import { $ } from "./parser/HTMLParser.js";
import { dcEmitter } from "./monitor/DeclarativeCrawlerEmitter";
import SpiderMessage from "./monitor/entity/SpiderMessage";
import execute from "../../fluent-fetcher/src/execute";
import Crawler from "./Crawler";

type ModelType = {
  [string]: string
};

/**
 * @function 爬虫类
 */
export default class Spider {
  /**
   * @region 继承方式声明的属性
   */
  // 当前类名
  name: string = this.constructor.name;

  // 组件名
  displayName: string = "Spider";

  // 模型定义
  model: ModelType = {};

  /**
   * @region 构造函数方式传入的属性
   */
  url: string;

  option = {};

  /**
   * @region 手动设置的属性
   */
  crawler: Crawler;

  // 方法定义
  /**
   * @function 构造函数
   */
  constructor() {}

  /**
   * @param url
   * @param option
   * @returns {Spider}
   */
  setRequest(url: string, option: Object): Spider {
    // 设置路径与配置
    url && (this.url = url);
    option && (this.option = option);

    return this;
  }

  /**
   * @function 设置当前蜘蛛所属的爬虫
   * @param crawler
   */
  setCrawler(crawler?: Crawler) {
    crawler && (this.crawler = crawler);
  }

  /**
   * @function 数据抓取
   */
  async fetch(url: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      // 设置抓取过时，最多 1 分钟
      setTimeout(() => {
        reject(
          new Error(
            JSON.stringify({
              spiderName: this.name,
              message: "抓取超时",
              url: this.url,
              time: new Date()
            })
          )
        );
      }, 60 * 1000);

      resolve(await execute(url, this.option, "text"));
    });
  }

  /**
   * @function 数据提取之前的预处理
   * @param {*} pageHTML 
   */
  before_extract(pageHTML: string): string {
    return pageHTML;
  }

  // 数据提取
  async extract(pageHTML: string): Object {
    let pageObject = {};

    // 执行数据抽取
    let dom = $(pageHTML);

    for (let key in this.model) {
      pageObject[key] = dom.find(this.model[key]);
    }

    return pageObject;
  }

  // 数据解析
  async parse(pageElements: { [string]: Element }): any {
    return {};
  }

  // 数据存储
  async persist(pageObject: Array<any>): Promise<boolean> {
    return new Promise((resolve, reject) => {
      resolve(true);
    });
  }

  /**
   * @function 自动运行
   * @param isPersist
   * @returns {Promise.<Array.<Object>>}
   */
  async run(isPersist: boolean = true): Promise<Array<any>> {
    dcEmitter.emit(
      "Spider",
      new SpiderMessage(SpiderMessage.START_FETCH, this)
    );

    // 执行数据抓取
    let pageHTML: string = await this.fetch(this.url);

    dcEmitter.emit(
      "Spider",
      new SpiderMessage(SpiderMessage.FINISH_FETCH, this)
    );

    pageHTML = this.before_extract(pageHTML);

    // 从界面中抽取出选定元素
    let pageElements = await this.extract(pageHTML);

    dcEmitter.emit(
      "Spider",
      new SpiderMessage(SpiderMessage.START_PARSE, this)
    );

    // 对元素进行解析
    let pageObject: Object = await this.parse(pageElements);

    dcEmitter.emit(
      "Spider",
      new SpiderMessage(SpiderMessage.FINISH_PARSE, this)
    );

    if (isPersist) {
      dcEmitter.emit(
        "Spider",
        new SpiderMessage(SpiderMessage.START_PERSIST, this)
      );

      // 一组执行完毕后进行数据写入
      await this.persist(pageObject);

      dcEmitter.emit(
        "Spider",
        new SpiderMessage(SpiderMessage.FINISH_PERSIST, this)
      );
    }

    return pageObject;
  }
}
