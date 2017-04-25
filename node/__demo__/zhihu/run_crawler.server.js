// @flow

import CrawlerScheduler from "../../crawler/CrawlerScheduler";
import CrawlerServer from "../../server/CrawlerServer";

const crawlerScheduler: CrawlerScheduler = new CrawlerScheduler();

let uaCrawler = new UACrawler({
  module: "jsgc",
  name: "房建市政招标公告-服务类",
  menuCode: "001001/001001001/00100100100",
  category: "1"
});

crawlerScheduler.register(uaCrawler);

new CrawlerServer(crawlerScheduler).run().then(
  () => {},
  error => {
    console.log(error);
  }
);
