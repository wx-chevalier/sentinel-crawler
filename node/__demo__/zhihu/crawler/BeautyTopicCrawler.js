// @flow

import TopicSpider from "../spider/TopicSpider";
import AnswerAndPersistImageSpider from "../spider/AnswerAndPersistImageSpider";
import Crawler from "../../../src/crawler/Crawler";

export default class BeautyTopicCrawler extends Crawler {
  // 初始化爬虫

  initialize() {
    // 构建所有的爬虫
    let requests = [
      { url: "https://www.zhihu.com/topic/19552207/top-answers" },
      { url: "https://www.zhihu.com/topic/19606792/top-answers" }
    ];

    this.setRequests(requests)
      .setSpider(
        new TopicSpider().setChromeOption("120.55.83.19", null, 10 * 1000)
      )
      .transform(feedItems => {
        if (!Array.isArray(feedItems)) {
          throw new Error("爬虫连接失败！");
        }
        return feedItems.map(feedItem => {
          // 判断 URL 中是否存在 zhihu.com，若存在则直接返回
          const href = feedItem.answerHref;

          if (!!href) {
            // 存在有效二级链接
            return href.indexOf("zhihu.com") > -1
              ? href
              : `https://www.zhihu.com${href}`;
          }
        });
      })
      .setSpider(
        new AnswerAndPersistImageSpider().setChromeOption(
          "120.55.83.19",
          null,
          10 * 1000
        )
      );
  }
}
