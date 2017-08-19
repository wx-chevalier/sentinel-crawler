// @flow

import CrawlerScheduler from '../../src/source/crawler/CrawlerScheduler';
import CrawlerServer from '../../src/server/CrawlerServer';
import APICrawler from './crawler/APICrawler';

const crawlerScheduler: CrawlerScheduler = new CrawlerScheduler();
const apiCrawler = new APICrawler();

// 注册
crawlerScheduler.register(apiCrawler);

new CrawlerServer(crawlerScheduler).run().then(
  () => {},
  error => {
    console.log(error);
  }
);
