// @flow

import Crawler from "../../../src/crawler/Crawler";

export default class NewsCrawler extends Crawler {
  initialize() {
    // 构建所有的爬虫
    let requests = [{ url: "https://news.ycombinator.com/news" }];

    this.setRequests(requests).setSpider(
      new TopicSpider().setChromeOption("120.55.83.19", null, 10 * 1000)
    );
  }
}
