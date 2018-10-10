// @flow

import CrawlerScheduler from '../../../source/crawler/CrawlerScheduler';
import Crawler from '../../../source/crawler/Crawler';
import Spider from '../../../source/spider/Spider';
import SpiderTask from '../../../source/crawler/SpiderTask';

/**
 * Description 从原始数据中进行统计性合并
 */
export default class CrawlerReporter {
  /**
   * Description 获取爬虫的统计信息
   * @param crawlerScheduler
   */
  static getCrawlerListStatistics(crawlerScheduler: CrawlerScheduler) {
    let statistic = [];

    for (let crawlerName in crawlerScheduler.crawlers) {
      let crawler = crawlerScheduler.crawlers[crawlerName];

      statistic.push({
        name: crawler.name,
        displayName: crawler.displayName,
        isRunning: crawler.isRunning,
        executedSpiderTaskNum:
          crawler.successfulSpiderTasks.length +
          crawler.failedSpiderTasks.length,
        waitingSpiderTasksNum: crawler.waitingSpiderTasks.length,
        successfulSpiderTasksNum: crawler.successfulSpiderTasks.length,
        failedSpiderTasksNum: crawler.failedSpiderTasks.length,
        lastStartTime: crawler.lastStartTime,
        lastFinishTime: crawler.lastFinishTime,
        lastErrorMessage: crawler.lastErrorMessage
      });
    }

    return statistic;
  }

  /**
   * Description 根据蜘蛛名获取分组蜘蛛的运行情况
   * @param crawler
   */
  static getSpiderListStatisticsByName(crawler: Crawler) {
    return crawler.spiders.map((spider: Spider) => {
      let countByTime = {},
        count = 0,
        totalExecuteDuration = 0;

      // relatedSuccessfulSpiderTasks
      let rSST = crawler.successfulSpiderTasks.filter(
        (spiderTask: SpiderTask) => {
          return spiderTask.spiderInstance.name === spider.name;
        }
      );

      // relatedFailedSpiderTasks
      let rFST = crawler.failedSpiderTasks.filter((spiderTask: SpiderTask) => {
        return spiderTask.spiderInstance.name === spider.name;
      });

      // 遍历所有执行成功的，计算其开始的分钟数并且加一
      rSST.forEach((spiderTask: SpiderTask) => {
        let minute = spiderTask.startTime.getMinutes();

        countByTime[minute] ? countByTime[minute]++ : (countByTime[minute] = 1);
        count++;
        totalExecuteDuration += spiderTask.elapsedTime;
      });

      let lastSuccessfulTime =
        rSST.length > 0 ? rSST[rSST.length - 1].startTime : null;

      let lastFailedTime =
        rFST.length > 0 ? rFST[rFST.length - 1].startTime : null;

      // 最后一次执行是否成功
      let isSuccessInLastExecution = lastFailedTime
        ? // 如果存在最后失败时间，则比较时间
          lastSuccessfulTime > lastFailedTime
        : // 则默认成功
          true;

      return {
        // 基本属性
        name: spider.name,
        displayName: spider.displayName,

        // 依赖属性
        dependencies: spider.dependencies.map((spider: Spider) => ({
          name: spider.name,
          displayName: spider.displayName
        })),

        // 执行数目统计
        count,
        countByTime,

        // 最后一次执行是否正常
        isSuccessInLastExecution,

        // 执行信息
        lastSuccessfulTime,
        executeDuration: count > 0 ? totalExecuteDuration / count : 0,

        // 错误信息
        lastFailedTime,
        errorCount: rFST.length
      };
    });
  }

  static getSpiderListStatisticsByUUID(crawler: Crawler) {}
}
