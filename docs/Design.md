# declarative-crawler 设计思想与原则


当笔者几年前编写第一个爬虫时，整体思路是典型的命令式编程，即先抓取再解析，最后持久化存储，就如下述代码：
```
await fetchListAndContentThenIndex(
    'jsgc',
    section.name,
    section.menuCode,
    section.category
).then(() => {
}).catch(error => {
    console.log(error);
});
```
不过就好像笔者在 [2016-我的前端之路:工具化与工程化](https://zhuanlan.zhihu.com/p/24575395) 与 [2015-我的前端之路:数据流驱动的界面](https://segmentfault.com/a/1190000004292245) 中讨论的，命令式编程相较于声明式编程耦合度更高，可测试性与可控性更低；就好像从 jQuery 切换到 React、Angular、Vue.js 这样的框架，我们应该尽可能将业务之外的事情交由工具，交由框架去管理与解决，这样也会方便我们进行自定义地监控。总结而言，笔者的设计思想主要包含以下几点：

- 关注点分离，整个架构分为了爬虫调度 CrawlerScheduler、Crawler、Spider、dcEmitter、Store、KoaServer、MonitorUI 等几个部分，尽可能地分离职责。
- 声明式编程，每个蜘蛛的生命周期包含抓取、抽取、解析与持久化存储这几个部分；开发者应该独立地声明这几个部分，而完整的调用与调度应该由框架去完成。
- 分层独立可测试，以爬虫的生命周期为例，抽取与解析应当声明为纯函数，而抓取与持久化存储更多的是面向业务，可以进行 Mock 或者包含副作用进行测试。

整个爬虫网络架构如下所示，目前全部代码参考[这里](https://parg.co/bR2)。

![](https://coding.net/u/hoteam/p/Cache/git/raw/master/2017/3/2/declarative-crawler.q.png)

## 异常处理

对于所有的非受控异常，Let It Crash! 