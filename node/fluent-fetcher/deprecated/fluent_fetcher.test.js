// /**
//  * Created by apple on 16/9/9.
//  */
import FluentFetcher from "./fluent_fetcher.test";
require("isomorphic-fetch");

var expect = require("chai").expect;

const host = "jsonplaceholder.typicode.com";

let fluentFetcher = new FluentFetcher({ scheme: "http", host });

//测试MOCK
describe("MOCK请求测试", function() {
  it("对于MOCK数据应该正常返回本地值", function(done) {
    fluentFetcher
      .get("/mock")
      .mock({ "/mock": { test: "data" } })
      .build()
      .then(data => {
        expect(data).to.be.a("object");

        expect(data.test).to.equal("data");

        done();
      });
  });
});

//测试GET类型请求
describe("GET请求测试", function() {
  //https://jsonplaceholder.typicode.com/posts?userId=1
  it("获取博文", function(done) {
    fluentFetcher
      .parameter({ userId: "1" })
      .get("/posts")
      .build()
      .then(data => {
        expect(data).to.be.a("array");
        expect(data.length).to.be.above(0);
        done();
      })
      .catch(error => {
        done(error);
      });
  });
});

//测试POST类型请求
describe("POST请求测试", function() {
  //https://jsonplaceholder.typicode.com/posts?userId=1
  it("创建博文@表单编码格式", function(done) {
    fluentFetcher
      .parameter({
        title: "foo",
        body: "bar",
        userId: 1
      })
      .post("/posts", "x-www-form-urlencoded")
      .build()
      .then(data => {
        expect(data).to.be.a("object");
        expect(data.id).to.equal(101);
        expect(data.title).to.equal("foo");
        expect(data.body).to.equal("bar");
        expect(data.userId).to.equal(1);

        done();
      })
      .catch(error => {
        done(error);
      });
  });

  //https://jsonplaceholder.typicode.com/posts?userId=1
  it("创建博文@JSON格式", function(done) {
    fluentFetcher
      .parameter({
        title: "foo",
        body: "bar",
        userId: 1
      })
      .post("/posts")
      .build()
      .then(data => {
        expect(data).to.be.a("object");
        expect(data.id).to.equal(101);
        expect(data.title).to.equal("foo");
        expect(data.body).to.equal("bar");
        expect(data.userId).to.equal(1);

        done();
      })
      .catch(error => {
        done(error);
      });
  });
});
