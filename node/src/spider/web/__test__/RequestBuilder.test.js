const chaiExpect = require("chai").expect;
import { RequestBuilder } from "fluent-fetcher";

describe("无请求体请求", () => {
  test("构建 GET 请求", () => {
    let { url, option }: RequestType = new RequestBuilder({})
      .get("/user")
      .build();

    chaiExpect(url).to.equal("http://api.com/user");
    chaiExpect(option).to.deep.equal({
      method: "get",
      headers: { "Content-Type": "application/json" },
      body: null
    });
  });

  test("构建带查询参数的 GET 请求", () => {
    let { url, option }: RequestType = new RequestBuilder({ scheme: "https" })
      .get("/user")
      .build({
        queryParam: 1,
        b: "c"
      });

    chaiExpect(url).to.equal("https://api.com/user?queryParam=1&b=c");
  });
});

describe("包含请求体的请求", () => {
  test("构建 POST 请求", () => {
    let { url, option }: RequestType = new RequestBuilder({})
      .post("/user")
      .build({
        queryParam: 1,
        b: "c"
      });

    chaiExpect(url).to.equal("http://api.com/user?queryParam=1&b=c");

    chaiExpect(option).to.deep.equal({
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: "{}"
    });
  });

  test("构建表单格式 POST 请求", () => {
    let { url, option }: RequestType = new RequestBuilder({})
      .post("/user", { a: 1 }, "x-www-form-urlencoded")
      .build({
        queryParam: 1,
        b: "c"
      });

    chaiExpect(url).to.equal("http://api.com/user?queryParam=1&b=c");

    chaiExpect(option.body).to.equal("a=1");
  });
});

describe("其他请求构建策略", () => {
  test("连续构建并且自动重置", () => {
    let requestBuilder = new RequestBuilder({
      scheme: "https",
      host: "test.com",
      encoding: "utf-8"
    });

    let { url: getUrl, option: getOption } = requestBuilder
      .get("/get")
      .header("a", "b")
      .build({
        getParam: 1
      });

    let { url: postUrl, option: postOption } = requestBuilder
      .post("/post", { c: "d" })
      .pathSegment("/a")
      .build();

    // 判断请求地址的一致性
    expect(getUrl).toBe("https://test.com/get?getParam=1");
    expect(postUrl).toEqual("https://test.com/post/%2Fa");

    // 判断 GET 请求中包含头
    expect(getOption.headers).toHaveProperty("a", "b");

    // 判断 POST 请求中不包含头与参数
    expect(getOption.headers).toHaveProperty("a", "b");
  });
});
