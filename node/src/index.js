// 导出蜘蛛
export { default as Spider } from "./source/spider/Spider";
export { default as HTMLSpider } from "./source/spider/web/HTMLSpider";
export {
  default as HeadlessChromeSpider
} from "./source/spider/web/HeadlessChromeSpider";

// 导出爬虫
export { default as Crawler } from "./source/crawler/Crawler";

// 导出爬虫调度器
export { default as CrawlerScheduler } from "./source/crawler/CrawlerScheduler";

// 导出全局唯一值
export { dcEmitter, store } from "./source/crawler/supervisor";

// 导出持久化器
export { default as DownloadPersistor } from "./sink/persist/DownloadPersistor";

// 导出服务端
export { default as CrawlerServer } from "./server/CrawlerServer";
