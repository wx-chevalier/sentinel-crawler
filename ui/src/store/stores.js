// @flow

import HomeStore from "./HomeStore.js";
import StatisticStore from "./StatisticStore.js";

const homeStore = new HomeStore();
const statisticStore = new StatisticStore();

homeStore.getSpiderList();
statisticStore.requestStatistic();

/**
 * Description 获取 Stores 数据
 * @param crawlerServer
 * @returns {{homeStore: HomeStore, statisticStore: StatisticStore}}
 */
export default function getStores(crawlerServer: string) {
  return {
    homeStore,
    statisticStore
  };
}
