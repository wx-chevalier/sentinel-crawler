// @flow
import NewsListSpider from "../spider/NewsListSpider";
const expect = require("chai").expect;

let newsListSpider: NewsListSpider = new NewsListSpider().setRequest(
  "https://news.ycombinator.com/news"
);

test("抓取 Hacker News 列表", async done => {
  // 不执行持久化操作
  let stories = await newsListSpider.run(false);

  console.log(stories);

  expect(stories, "返回数据为列表并且长度大于10").to.have.length.above(2);

  done();
});
