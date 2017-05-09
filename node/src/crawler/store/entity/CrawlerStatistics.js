// @flow

import { SpiderStatistics } from "./SpiderStatistics";
import Crawler from "../../Crawler";
/**
 * @function 爬虫统计信息
 */
export default class CrawlerStatistics {
  // 当前爬虫实例
  instance: Crawler;

  // 判断爬虫是否正在运行
  isRunning: boolean = false;

  // 爬虫最后一次激活时间
  lastStartTime: Date;

  // 爬虫最后一次运行结束时间
  lastFinishTime: Date;

  // 爬虫最后的异常信息
  lastError: Error;

  // 蜘蛛的统计信息
  spiderStatisticsList: {
    [string]: SpiderStatistics
  } = {};

  /**
   * @function 默认构造函数
   * @param instance
   */
  constructor(instance: Crawler) {
    this.instance = instance;
  }

  /**
   * @function 获取所有的爬虫信息
   */
  get spiders() {
    let spiderStatusList = [];

    // 遍历所有的爬虫统计信息
    for (let spiderName in this.spiderStatisticsList) {
      let spiderStatistics: SpiderStatistics = this.spiderStatisticsList[
        spiderName
      ];

      // 添加爬虫统计信息
      spiderStatusList.push({
        name: spiderStatistics.instance.name,
        displayName: spiderStatistics.instance.displayName,
        count: spiderStatistics.count,
        countByTime: spiderStatistics.countByTime,
        lastActiveTime: spiderStatistics.lastActiveTime,
        executeDuration: spiderStatistics.executeDuration,
        errorCount: spiderStatistics.errorCount
      });
    }

    return spiderStatusList;
  }
}
