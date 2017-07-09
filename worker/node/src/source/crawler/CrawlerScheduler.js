// @flow

import Crawler from "./Crawler";
import { dcEmitter } from "../../supervisor/singleton";
import CrawlerMessage from "../../supervisor/entity/CrawlerMessage";

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

  // 存放爬虫的最后一次运行的信息

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
  async run(crawlerNameToRun: string) {
    let crawlerNames = Object.keys(
      this.crawlers
    ).filter((crawlerName: string) => {
      // 如果没有设置过滤值，则默认全部运行
      if (!crawlerNameToRun) {
        return true;
      } else {
        // 否则仅运行指定爬虫
        return crawlerName === crawlerNameToRun;
      }
    });

    for (let crawlerName of crawlerNames) {
      let crawler: Crawler = this.crawlers[crawlerName];

      // 当爬虫尚未运行时运行该爬虫
      if (!crawler.isRunning) {
        // 发出消息提示爬虫已启动
        dcEmitter.emit(
          "Crawler",
          new CrawlerMessage(CrawlerMessage.START, crawler)
        );

        // 异步运行该爬虫
        crawler.run().then(
          result => {
            // 触发爬虫运行完毕事件
            dcEmitter.emit(
              "Crawler",
              new CrawlerMessage(CrawlerMessage.FINISH, crawler)
            );
          },
          error => {
            // 出现异常之后，重置当前爬虫
            crawler.reset();

            // 触发爬虫运行异常数据
            dcEmitter.emit(
              "Crawler",
              new CrawlerMessage(CrawlerMessage.ERROR, crawler, error.message)
            );
          }
        );
      }
    }

    // 设置定时器，更新爬虫执行安排
    setInterval(() => {
      this.scheduleCrawler();
    }, 1000);
  }

  /**
   * @function 根据间隔信息判断是否需要重新执行爬虫抓取操作
   */
  scheduleCrawler() {}
}

/**
 * @function 定时执行爬虫
 * @param day
 * @param hour
 * @param minute
 * @param second
 * @returns {function(*, *, *)}
 */
export function interval(day = 0, hour = 0, minute = 0, second = 0) {
  return (target, key, descriptor) => {
    return descriptor;
  };
}
