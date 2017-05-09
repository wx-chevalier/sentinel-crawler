const expectChai = require("chai").expect;
import { RequestBuilder, execute } from "fluent-fetcher";

const requestBuilder = new RequestBuilder({
  scheme: "https",
  host: "jsonplaceholder.typicode.com"
});

describe("测试请求", () => {
  test("测试基本 GET 请求", async () => {
    const { url: getUrl, option: getOption } = requestBuilder
      .get("/posts")
      .build();

    let posts = await execute(getUrl, getOption);

    expectChai(posts).to.have.length(100);
  });

  test("测试带路径参数的 GET 请求", async () => {
    const { url: getUrl, option: getOption } = requestBuilder
      .get("/posts")
      .pathSegment("1")
      .build();

    let posts = await execute(getUrl, getOption);

    expectChai(posts.id).to.equal(1);
  });

  test("测试基本 POST 请求", async () => {
    const params = {
      body: "bodybody",
      userId: 123456
    };

    const { url, option } = requestBuilder.post("/posts", params).build();

    let posts = await execute(url, option);

    expectChai(posts).to.have.property("body", "bodybody");
  });
});

describe("异常处理", () => {
  test("错误处理，能够返回正确错误码", async () => {
    try {
      await execute(
        "https://api.github.com/repos/vmg/red11carpet/issues?state=closed"
      );
    } catch (error) {
      expectChai(JSON.parse(error.message)).to.have.property("status");
    }
  });
});

describe("策略测试", () => {
  test("测试中断", done => {
    let fnResolve = jest.fn();
    let fnReject = jest.fn();

    let promise = execute("https://jsonplaceholder.typicode.com");

    promise.then(fnResolve, fnReject);

    // 撤销该请求
    promise.abort();

    // 异步验证
    setTimeout(() => {
      // fn 不应该被调用
      expect(fnResolve).not.toHaveBeenCalled();
      expect(fnReject).toHaveBeenCalled();
      done();
    }, 500);
  });

  test("测试超时", done => {
    let fnResolve = jest.fn();
    let fnReject = jest.fn();

    let promise = execute("https://jsonplaceholder.typicode.com");

    promise.then(fnResolve, fnReject);

    // 设置超时
    promise.timeout = 10;

    // 异步验证
    setTimeout(() => {
      // fn 不应该被调用
      expect(fnResolve).not.toHaveBeenCalled();
      expect(fnReject).toHaveBeenCalled();
      done();
    }, 500);
  });
});
