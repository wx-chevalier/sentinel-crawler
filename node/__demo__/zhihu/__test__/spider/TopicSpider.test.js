// @flow
import TopicSpider from "../../spider/TopicSpider";

let topicSpider: TopicSpider = new TopicSpider()
  .setRequest("https://www.zhihu.com/topic/19552207/top-answers")
  .setChromeOption("120.55.83.19");

test("抓取知乎某个话题下答案列表", async done => {
  let answers = await topicSpider.run(false);

  done();
});
