var expect = require("chai").expect;
import execute from "../src/execute.js";
import RequestBuilder from "../src/RequestBuilder.js";

const requestBuilder = new RequestBuilder({
  scheme: "https",
  host: "jsonplaceholder.typicode.com"
});

test("测试基本 GET 请求", async () => {
  const { url: getUrl, option: getOption } = requestBuilder
    .get("/posts")
    .build();

  let posts = await execute(getUrl, getOption);

  expect(posts).to.have.length(100);
});

test("测试基本 GET 文本请求", async () => {
  const { url, option } = requestBuilder.get("/posts").build();

  let posts = await execute(
    "http://ggzy.njzwfw.gov.cn/njggzy/jsgc/001001/001001001/001001001001/?Paging=1",
    option,
    "text"
  );
});

test("测试带路径参数的 GET 请求", async () => {
  const { url: getUrl, option: getOption } = requestBuilder
    .get("/posts")
    .pathSegment("1")
    .build();

  let posts = await execute(getUrl, getOption);

  expect(posts.id).to.equal(1);
});

test("测试基本 POST 请求", async () => {
  const params = {
    body: "bodybody",
    userId: 123456
  };

  const { url, option } = requestBuilder.post("/posts", params).build();

  let posts = await execute(url, option);

  expect(posts).to.have.property("body", "bodybody");
});

test("错误处理，能够返回正确错误码", async () => {
  try {
    await execute(
      "https://api.github.com/repos/vmg/red11carpet/issues?state=closed"
    );
  } catch (error) {
    expect(JSON.parse(error.message)).to.have.property("status");
  }
});
