// @flow
const CDP = require("chrome-remote-interface");
const fs = require("fs");

CDP(
  {
    host: "120.55.83.19",
    port: "9222"
  },
  client => {
    // 设置网络与页面处理句柄
    const { Network, Page, Runtime, Input } = client;
    // setup handlers
    Network.requestWillBeSent(params => {
      console.log(params.request.url);
    });

    Page.loadEventFired(async () => {
      // 执行页面下滚操作

      await Input.synthesizeScrollGesture({
        x: 0,
        y: 0,
        yDistance: -10000,
        repeatCount: 10
      });

      Runtime.evaluate({
        expression: "document.body.outerHTML"
      }).then(result => {
        // console.log(result.result.value);
        // client.close();
      });
    });
    // enable events then start!
    Promise.all([Network.enable(), Page.enable(), Runtime.enable()])
      .then(() => {
        return Page.navigate({
          url: "https://www.zhihu.com/question/29134042"
        });
      })
      .catch(err => {
        console.error(err);
        client.close();
      });
  }
).on("error", err => {
  // cannot connect to the remote endpoint
  console.error(err);
});
