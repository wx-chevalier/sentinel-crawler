// @flow

import Crawler from "../../../src/source/crawler/Crawler";
import TopicSpider from "../../../src/source/spider/web/HeadlessChromeSpider";

/**
 * Description 新闻爬虫
 */
export default class NewsCrawler extends Crawler {
  initialize() {
    // 构建所有的爬虫
    let requests = [{ url: "https://news.ycombinator.com/news" }];

    this.setRequests(requests).setSpider(
      new TopicSpider().setChromeOption("120.55.83.19", null, 10 * 1000)
    );
  }
}
