// @flow
import TopicSpider from "../../spider/TopicSpider";
const expect = require("chai").expect;

let topicSpider: TopicSpider = new TopicSpider()
  .setRequest("https://www.zhihu.com/topic/19552207/top-answers")
  .setChromeOption("120.55.83.19");

test("抓取知乎某个话题下答案列表", async done => {
  let answers = await topicSpider.run(false);

  expect(answers, "返回数据为列表并且长度大于10").to.have.length.above(2);

  done();
});
