// @flow

import CrawlerScheduler from "../../src/source/crawler/CrawlerScheduler";
import CrawlerServer from "../../src/server/CrawlerServer";
import BeautyTopicCrawler from "./crawler/BeautyTopicCrawler";

const crawlerScheduler: CrawlerScheduler = new CrawlerScheduler();

let beautyTopicCrawler = new BeautyTopicCrawler();

// 注册
crawlerScheduler.register(beautyTopicCrawler);

new CrawlerServer(crawlerScheduler).run().then(
  () => {},
  error => {
    console.log(error);
  }
);
