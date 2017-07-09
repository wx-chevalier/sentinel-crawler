// @flow
import { SpiderStatistics } from "../entity/SpiderStatistics";
import Crawler from "../../source/crawler/Crawler";
import Spider from "../../source/spider/Spider";
import CrawlerStatistics from "../entity/CrawlerStatistics";

/**
 * Description 存放系统
 */
export default class Store {
  // 存放爬虫统计信息列表
  crawlerStatisticsMap: { [string]: CrawlerStatistics } = {};

  /**
   * @function 增加某个爬虫的调用频次
   * @param spider
   * @param time
   * @param crawler
   */
  incrementSpiderCount = (spider: Spider, time: Date, crawler: Crawler) => {
    // 判断是否存在该爬虫的统计信息，不存在则创建
    if (!crawler.name in this.crawlerStatisticsMap) {
      this.crawlerStatisticsMap[crawler.name] = new CrawlerStatistics(crawler);
    }

    // 取出爬虫统计信息
    let crawlerStatistics: CrawlerStatistics = this.crawlerStatisticsMap[
      crawler.name
    ];

    if (!crawlerStatistics) {
      return;
    }

    // 获取蜘蛛的对应名
    let key = spider.name;

    // 判断是否存在
    if (!crawlerStatistics.spiderStatisticsList[key]) {
      crawlerStatistics.spiderStatisticsList[key] = new SpiderStatistics(
        spider,
        time
      );
    }

    // 将爬虫次数加一
    crawlerStatistics.spiderStatisticsList[key].incrementCount(time);
  };

  /**
   * @function 更新某个蜘蛛的执行时间
   * @param spider
   * @param duration
   * @param crawler
   */
  updateSpiderExecuteTime = (
    spider: Spider,
    duration: time,
    crawler: Crawler
  ) => {
    // 获取当前的蜘蛛对象
    let crawlerStatistics: CrawlerStatistics = this.crawlerStatisticsMap[
      crawler.name
    ];

    if (!crawlerStatistics) {
      return;
    }

    // 更新蜘蛛执行时间
    crawlerStatistics.spiderStatisticsList[spider.name].updateExecuteDuration(
      duration
    );
  };

  /**
   * Description 添加蜘蛛的校验错误信息
   * @param spider
   * @param message
   * @param crawler
   */
  pushSpiderValidatedFailure = (
    spider: Spider,
    message: string,
    crawler: Crawler
  ) => {
    // 获取当前的蜘蛛对象
    let crawlerStatistics: CrawlerStatistics = this.crawlerStatisticsMap[
      crawler.name
    ];

    if (!crawlerStatistics) {
      return;
    }

    // 追加验证失败的错误信息
    crawlerStatistics.spiderStatisticsList[spider.name].validatedFailure.push({
      message,
      time: new Date()
    });
  };

  /**
   * @function 获取所有爬虫信息
   */
  get crawlers() {
    let crawlerStatusList = [];

    for (let crawlerName in this.crawlerStatisticsMap) {
      let crawlerStatistics: CrawlerStatistics = this.crawlerStatisticsMap[
        crawlerName
      ];

      let crawler: Crawler = crawlerStatistics.instance;

      // 将所有的错误信息编码存放
      crawlerStatusList.push({
        name: crawler.name,
        displayName: crawler.displayName,
        isRunning: crawlerStatistics.isRunning,
        executedSpiderTaskNum: crawler._executedSpiderTaskNum,
        leftSpiderTaskNum: crawler._spiderTasks.length,
        lastStartTime: crawlerStatistics.lastStartTime,
        lastFinishTime: crawlerStatistics.lastFinishTime,
        lastErrorMessage: crawlerStatistics.lastErrorMessage
          ? crawlerStatistics.lastErrorMessage
          : undefined
      });
    }

    return crawlerStatusList;
  }
}
