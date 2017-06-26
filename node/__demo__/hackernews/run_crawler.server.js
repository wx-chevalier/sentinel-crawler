// @flow

import CrawlerScheduler from "../../src/source/crawler/CrawlerScheduler";
import CrawlerServer from "../../src/server/CrawlerServer";

const crawlerScheduler: CrawlerScheduler = new CrawlerScheduler();

// 注册
crawlerScheduler.register();

new CrawlerServer(crawlerScheduler).run().then(
  info => {
    console.log(info);
  },
  error => {
    console.error(error);
  }
);
