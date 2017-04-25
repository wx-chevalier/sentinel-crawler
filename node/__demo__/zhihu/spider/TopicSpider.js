// @flow
import HeadlessChromeSpider from "../../../spider/web/HeadlessChromeSpider";
import { $ } from "../../../utils/parser/HTMLParser";

/**
 * @function 知乎某个话题答案的爬虫
 */
export default class TopicSpider extends HeadlessChromeSpider {
  // 定义模型
  model = {
    ".feed-item": {
      $questionLink: ".question_link",
      $summary: ".summary"
    }
  };

  /**
   * @function 默认解析函数
   * @param pageObject
   * @returns {Array}
   */
  parse(pageObject: any) {
    // 存放全部的抓取到的对象
    let feedItems = [];

    for (let { $questionLink, $summary } of pageObject[".feed-item"]) {
      feedItems.push({
        title: $questionLink.text(),
        href: "",
        summary: $summary.text()
      });
    }

    return feedItems;
  }
}
