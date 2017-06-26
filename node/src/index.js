// 导出蜘蛛
export { default as Spider } from "./spider/Spider";
export { default as HTMLSpider } from "./spider/web/HTMLSpider";
export {
  default as HeadlessChromeSpider
} from "./spider/web/HeadlessChromeSpider";

// 导出爬虫
export { default as Crawler } from "./source/crawler/Crawler";

// 导出爬虫调度器
export { default as CrawlerScheduler } from "./source/crawler/CrawlerScheduler";

// 导出全局唯一值
import { dcEmitter as _dcEmitter, store as _store } from "./source/crawler/supervisor";

// 导出持久化器
export {
  default as DownloadPersistor
} from "./sink/persist/DownloadPersistor";

export const dcEmitter = _dcEmitter;
export const store = _store;
