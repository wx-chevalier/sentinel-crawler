var expect = require("chai").expect;
import type { RequestType } from "../src/RequestBuilder.js";
import RequestBuilder from "../src/RequestBuilder.js";

test("构建 GET 请求", () => {
  let { url, option }: RequestType = new RequestBuilder({})
    .get("/user")
    .build();

  expect(url).to.equal("http://api.com/user");
  expect(option).to.deep.equal({
    method: "get",
    headers: { "Content-Type": "application/json" },
    body: null
  });
});

test("构建带查询参数的 GET 请求", () => {
  let { url, option }: RequestType = new RequestBuilder({scheme:"https"}).get("/user").build({
    queryParam: 1,
    b: "c"
  });

  expect(url).to.equal("https://api.com/user?queryParam=1&b=c");
});

test("构建 POST 请求", () => {
  let { url, option }: RequestType = new RequestBuilder({})
    .post("/user")
    .build({
      queryParam: 1,
      b: "c"
    });

  expect(url).to.equal("http://api.com/user?queryParam=1&b=c");

  expect(option).to.deep.equal({
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

  expect(url).to.equal("http://api.com/user?queryParam=1&b=c");

  expect(option.body).to.equal("a=1");
});
