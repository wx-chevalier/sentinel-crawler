// @flow
import HeadlessChromeSpider
  from "../../../src/source/spider/web/HeadlessChromeSpider";
/**
 * @function 知乎某个话题答案的爬虫
 */
export default class TopicSpider extends HeadlessChromeSpider {
  static displayName = "话题蜘蛛";

  // 定义模型
  model = {
    ".feed-item": {
      $summary: ".summary",
      $question: ".question_link"
    }
  };

  /**
   * @function 默认解析函数
   * @param pageObject
   * @param $
   * @returns {Array}
   */
  parse(pageObject: any, $: Element) {
    // 存放全部的抓取到的对象
    let feedItems = [];

    for (let { $question, $summary } of pageObject[".feed-item"]) {
      feedItems.push({
        questionTitle: $question.text(),
        questionHref: $question.attr("href"),
        answerHref: $($summary.find("a")).attr("href"),
        summary: $summary.text()
      });
    }

    return feedItems;
  }
}
