// @flow

import Crawler from "./Crawler";
import { dcEmitter } from "./monitor/DeclarativeCrawlerEmitter";
import CrawlerMessage from "./monitor/entity/CrawlerMessage";

// 爬虫策略项配置
type ScheduleOptionType = {
  singleThread: boolean
};

/**
 * @function 爬虫注册与调度
 */
export default class CrawlerScheduler {
  // 存放所有爬虫的信息
  crawlers: { [string]: Crawler } = {};

  constructor() {}

  /**
   * @function 注册爬虫
   * @param crawler
   */
  register = (crawler: Crawler) => {
    // 初始化爬虫
    crawler.initialize();

    // 将爬虫添加到当前队列中
    this.crawlers[crawler.name] = crawler;

    dcEmitter.emit(
      "Crawler",
      new CrawlerMessage(CrawlerMessage.REGISTER, crawler)
    );
  };

  /**
   * @function 反注册爬虫
   * @param crawlerOrName
   */
  deregister = (crawlerOrName: [Crawler | string]) => {
    delete this.crawlers[crawlerOrName];
  };

  /**
   * @function 开始以既定运行策略运行爬虫系统
   * @returns {Promise.<void>}
   */
  async schedule(option?: ScheduleOptionType) {}

  /**
   * @function 运行整个爬虫系统
   * @returns {Promise.<void>}
   */
  async run() {
    let crawlerNames = Object.keys(this.crawlers);

    for (let crawlerName of crawlerNames) {
      let crawler = this.crawlers[crawlerName];
      // 当爬虫尚未运行时运行该爬虫
      if (!crawler.isRunning) {

        // 发出消息提示爬虫已启动
        dcEmitter.emit(
          "Crawler",
          new CrawlerMessage(CrawlerMessage.START, crawler)
        );

        try {
          // 运行爬虫
          await crawler.run();

          dcEmitter.emit(
            "Crawler",
            new CrawlerMessage(CrawlerMessage.FINISH, crawler)
          );
        } catch (error) {
          // 出现异常之后，重置当前爬虫
          crawler.reset();

          dcEmitter.emit(
            "Crawler",
            new CrawlerMessage(CrawlerMessage.ERROR, crawler, error)
          );
        }
      }
    }
  }
}
