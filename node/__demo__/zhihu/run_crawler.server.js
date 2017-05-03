// @flow

import CrawlerScheduler from "../../crawler/CrawlerScheduler";
import CrawlerServer from "../../server/CrawlerServer";
import BeautyTopicCrawler from "./crawler/BeautyTopicCrawler";

const crawlerScheduler: CrawlerScheduler = new CrawlerScheduler();

let beautyTopicCrawler = new BeautyTopicCrawler();
crawlerScheduler.register(beautyTopicCrawler);

new CrawlerServer(crawlerScheduler).run().then(
  () => {},
  error => {
    console.log(error);
  }
);
