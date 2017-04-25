// @flow
import AnswerAndPersistImageSpider
  from "../../spider/AnswerAndPersistImageSpider";
const expect = require("chai").expect;

global.jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000;

// 初始化
let answerAndPersistImageSpider: AnswerAndPersistImageSpider = new AnswerAndPersistImageSpider()
  .setRequest("https://www.zhihu.com/question/29134042")
  .setChromeOption("120.55.83.19", null, 10 * 1000);

test("抓取知乎某个问题中所有的图片", async done => {
  let images = await answerAndPersistImageSpider.run(true);

  expect(images, "返回数据为列表并且长度大于10").to.have.length.above(2);

  done();
});
