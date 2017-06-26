// @flow
// 核心调度程序

import SpiderMessage from "./store/entity/SpiderMessage";
import CrawlerStatistics from "./store/entity/CrawlerStatistics";
import CrawlerMessage from "./store/entity/CrawlerMessage";
import Store from "./store/Store";
import dcEmitter from "./store/DeclarativeCrawlerEmitter";

const store = new Store();

// 监听并且存储信息
dcEmitter.on("Crawler", (crawlerMessage: CrawlerMessage) => {
  // 获取当前爬虫名
  let crawlerName = crawlerMessage.instance.name;

  switch (crawlerMessage.type) {
    // 爬虫注册事件
    case CrawlerMessage.REGISTER:
      //将爬虫信息添加到存储中
      store.crawlerStatisticsMap[crawlerName] = new CrawlerStatistics(
        crawlerMessage.instance
      );

      break;
    // 爬虫启动事件
    case CrawlerMessage.START:
      // 修正爬虫启动与最后一次运行时间
      if (store.crawlerStatisticsMap[crawlerName]) {
        store.crawlerStatisticsMap[crawlerName].isRunning = true;
        store.crawlerStatisticsMap[crawlerName].lastStartTime = new Date();
      }

      break;
    // 爬虫出错
    case CrawlerMessage.ERROR:
      if (store.crawlerStatisticsMap[crawlerName]) {
        store.crawlerStatisticsMap[crawlerName].lastError =
          crawlerMessage.content;
      }
      break;

    default:
      if (store.crawlerStatisticsMap[crawlerName]) {
        store.crawlerStatisticsMap[crawlerName].isRunning = false;
        store.crawlerStatisticsMap[crawlerName].lastFinishTime = new Date();
      }
      break;
  }

  dcEmitter.emit("StoreChange");
});

// 监听并且存储信息
dcEmitter.on("Spider", (spiderMessage: SpiderMessage) => {
  switch (spiderMessage.type) {
    case SpiderMessage.START_FETCH: {
      // 将蜘蛛的执行次数加一
      store.incrementSpiderCount(
        spiderMessage.instance,
        spiderMessage.time,
        spiderMessage.instance.crawler
      );

      break;
    }
    case SpiderMessage.LOG_EXECUTE_DURATION: {
      // 更新蜘蛛平均执行时间
      store.updateSpiderExecuteTime(
        spiderMessage.instance,
        spiderMessage.content,
        spiderMessage.instance.crawler
      );
      break;
    }
    default:
      break;
  }

  dcEmitter.emit("StoreChange");
});

export { dcEmitter, store };
