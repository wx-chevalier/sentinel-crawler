import HomeStore from './HomeStore.js'
import StatisticStore from './StatisticStore.js'

const homeStore = new HomeStore()
const statisticStore = new StatisticStore()

homeStore.getSpiderList()
statisticStore.requestStatistic()

export default {
  homeStore,
  statisticStore
}