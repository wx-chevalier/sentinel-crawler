// @flow

// 导出蜘蛛
export { default as Spider } from './source/spider/Spider';
export { default as HTMLSpider } from './source/spider/web/HTMLSpider';

// 导出爬虫
export { default as Crawler } from './source/crawler/Crawler';

// 导出爬虫调度器
export { default as CrawlerScheduler } from './source/crawler/CrawlerScheduler';

// 导出全局唯一值
export { dcEmitter } from './supervisor/singleton';

