// @flow
const CDP = require("chrome-remote-interface");

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
      // console.log(params.request.url);
    });
    Input.synthesizeScrollGesture({
      x: 0,
      y: 0,
      xDistance: 500,
      repeatCount: 10
    });
    Page.loadEventFired(() => {


      Runtime.evaluate({
        expression: "document.body.outerHTML"
      }).then(result => {
        console.log(1);
        // client.close();
      });
    });
    // enable events then start!
    Promise.all([Network.enable(), Page.enable()])
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
