// @flow

import StatisticStore from "./StatisticStore.js";
import CrawlerStore from "./CrawlerStore";
import DeclarativeCrawlerAPI from "../api/DeclarativeCrawlerAPI";

/**
 * Description 获取 Stores 数据
 * @param crawlerServer
 * @returns {{statisticStore: StatisticStore}}
 */
export default function getStores(crawlerServer: string) {
  let declarativeCrawlerAPI: DeclarativeCrawlerAPI = new DeclarativeCrawlerAPI();

  declarativeCrawlerAPI.setHost(crawlerServer);

  const statisticStore = new StatisticStore();
  const crawlerStore: CrawlerStore = new CrawlerStore(declarativeCrawlerAPI);

  // 进行数据预加载操作
  statisticStore.requestStatistic();

  return {
    statisticStore,
    crawlerStore
  };
}
