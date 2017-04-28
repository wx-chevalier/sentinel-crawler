
declarative-crawler 是遵循声明式、可监测理念的分布式爬虫，其计划提供 Node.js 与 Go 两种实现，能够对于静态 Web 页面、动态 Web 页面、关系型数据库、操作系统等异构多源数据进行抓取。declarative-crawler 希望让使用者专注于领域逻辑而不用考虑调度、监控等问题，并且稍加改造就能用于系统监控、ETL 数据迁移等领域。更多的 declarative-crawler 设计思想、设计规范参考下述文章：

- [基于 Node.js 的声明式可监控爬虫网络初探](https://zhuanlan.zhihu.com/p/26463840)：本文是最早的设计思想与用例概述，其中使用的部分用例已经废弃，可以阅读了解下笔者的原始设计思想。
- [浅论复杂智能爬虫的挑战与设计](./docs/Crawler.md)
- [declarative-crawler 设计思想与原则](./docs/Design.md)
- [CrawlerServer 接口规范](./docs/API.md)
- [监控界面设计规范](./docs/UI.md)


# 简单列表与详情页爬取

## 声明抓取单个页面的蜘蛛


我们以抓取某个在线[列表](http://ggzy.njzwfw.gov.cn/njggzy/jsgc/001001/001001001/001001001001/?Paging=1)与[详情页](http://ggzy.njzwfw.gov.cn/njggzy/infodetail/?infoid=2b69e958-5542-4d83-b7b9-e259c2037153&categoryNum=001001001001)为例，首先我们需要针对两个页面构建蜘蛛，注意，每个蜘蛛负责针对某个 URL 进行抓取与解析，用户应该首先编写列表爬虫，其需要声明 model 属性、复写 before_extract、parse 与 persist 方法，各个方法会被串行调用。另一个需要注意的是，我们爬虫可能会外部传入一些配置信息，统一的声明在了 extra 属性内，这样在持久化时也能用到。
```

type ExtraType = {
  module?: string,
  name?: string,
  menuCode?: string,
  category?: string
};

export default class UAListSpider extends Spider {

  displayName = "通用公告列表蜘蛛";

  extra: ExtraType = {};

  model = {
    $announcements: 'tr[height="25"]'
  };

  constructor(extra: ExtraType) {
    super();

    this.extra = extra;
  }

  before_extract(pageHTML: string) {
    return pageHTML.replace(/<TR height=\d*>/gim, "<tr height=25>");
  }

  parse(pageElements: Object) {
    let announcements = [];

    let announcementsLength = pageElements.$announcements.length;

    for (let i = 0; i < announcementsLength; i++) {
      let $announcement = $(pageElements.$announcements[i]);

      let $a = $announcement.find("a");
      let title = $a.text();
      let href = $a.attr("href");
      let date = $announcement.find('td[align="right"]').text();

      announcements.push({ title: title, date: date, href: href });
    }

    return announcements;
  }

  /**
   * @function 对采集到的数据进行持久化更新
   * @param pageObject
   */
  async persist(announcements): Promise<boolean> {
    let flag = true;

    // 这里每个 URL 对应一个公告数组
    for (let announcement of announcements) {
      try {
        await insertOrUpdateAnnouncement({
          ...this.extra,
          ...announcement,
          infoID: href2infoID(announcement.href)
        });
      } catch (err) {
        flag = false;
      }
    }

    return flag;
  }
}

```
我们可以针对这个蜘蛛进行单独测试，这里使用 Jest。注意，这里为了方便描述没有对抽取、解析等进行单元测试，在大型项目中我们是建议要加上这些纯函数的测试用例。
```
var expect = require("chai").expect;

import UAListSpider from "../../src/universal_announcements/UAListSpider.js";

let uaListSpider: UAListSpider = new UAListSpider({
  module: "jsgc",
  name: "房建市政招标公告-服务类",
  menuCode: "001001/001001001/00100100100",
  category: "1"
}).setRequest(
  "http://ggzy.njzwfw.gov.cn/njggzy/jsgc/001001/001001001/001001001001/?Paging=1",
  {}
);

test("抓取公共列表", async () => {
  let announcements = await uaListSpider.run(false);

  expect(announcements, "返回数据为列表并且长度大于10").to.have.length.above(2);
});

test("抓取公共列表 并且进行持久化操作", async () => {
  let announcements = await uaListSpider.run(true);

  expect(announcements, "返回数据为列表并且长度大于10").to.have.length.above(2);
});

```
同理，我们可以定义对于详情页的蜘蛛：
```
export default class UAContentSpider extends Spider {
  displayName = "通用公告内容蜘蛛";

  model = {
    // 标题
    $title: "#tblInfo #tdTitle b",

    // 时间
    $time: "#tblInfo #tdTitle font",

    // 内容
    $content: "#tblInfo #TDContent"
  };

  parse(pageElements: Object) {
    ...
  }

  async persist(announcement: Object) {
    ...
  }
}
```

## 声明执行完整任务链的爬虫


在定义完蜘蛛之后，我们可以定义负责爬取整个系列任务的 Crawler，注意，Spider 仅负责爬取单个页面，而分页等操作是由 Crawler 进行：
```

/**
 * @function 通用的爬虫
 */
export default class UACrawler extends Crawler {
  displayName = "通用公告爬虫";

  /**
   * @构造函数
   * @param config
   * @param extra
   */
  constructor(extra: ExtraType) {
    super();

    extra && (this.extra = extra);
  }

  initialize() {
    // 构建所有的爬虫
    let requests = [];

    for (let i = startPage; i < endPage + 1; i++) {
      requests.push(
        buildRequest({
          ...this.extra,
          page: i
        })
      );
    }

    this.setRequests(requests)
      .setSpider(new UAListSpider(this.extra))
      .transform(announcements => {
        if (!Array.isArray(announcements)) {
          throw new Error("爬虫连接失败！");
        }
        return announcements.map(announcement => ({
          url: `http://ggzy.njzwfw.gov.cn/${announcement.href}`
        }));
      })
      .setSpider(new UAContentSpider(this.extra));
  }
}

```
一个 Crawler 最关键的就是 initialize 函数，需要在其中完成爬虫的初始化。首先我们需要构造所有的种子链接，这里既是多个列表页；然后通过 setSpider 方法加入对应的蜘蛛。不同蜘蛛之间通过自定义的 Transformer 函数来从上一个结果中抽取出所需要的链接传入到下一个蜘蛛中。至此我们爬虫网络的关键组件定义完毕。

## 将爬虫注册到调度器


定义完 Crawler 之后，我们可以通过将爬虫注册到 CrawlerScheduler 来运行爬虫：
```
const crawlerScheduler: CrawlerScheduler = new CrawlerScheduler();

let uaCrawler = new UACrawler({
  module: "jsgc",
  name: "房建市政招标公告-服务类",
  menuCode: "001001/001001001/00100100100",
  category: "1"
});

crawlerScheduler.register(uaCrawler);

dcEmitter.on("StoreChange", () => {
  console.log("-----------" + new Date() + "-----------");
  console.log(store.crawlerStatisticsMap);
});

crawlerScheduler.run().then(() => {});
```
这里的 dcEmitter 是整个状态的中转站，如果选择使用本地运行，可以自己监听 dcEmitter 中的事件：
```
-----------Wed Apr 19 2017 22:12:54 GMT+0800 (CST)-----------
{ UACrawler: 
   CrawlerStatistics {
     isRunning: true,
     spiderStatisticsList: { UAListSpider: [Object], UAContentSpider: [Object] },
     instance: 
      UACrawler {
        name: 'UACrawler',
        displayName: '通用公告爬虫',
        spiders: [Object],
        transforms: [Object],
        requests: [Object],
        isRunning: true,
        extra: [Object] },
     lastStartTime: 2017-04-19T14:12:51.373Z } }
```

## 服务端运行爬虫网络并进行监控

我们也可以以服务的方式运行爬虫：
```
const crawlerScheduler: CrawlerScheduler = new CrawlerScheduler();

let uaCrawler = new UACrawler({
  module: "jsgc",
  name: "房建市政招标公告-服务类",
  menuCode: "001001/001001001/00100100100",
  category: "1"
});

crawlerScheduler.register(uaCrawler);

new CrawlerServer(crawlerScheduler).run().then(()=>{},(error)=>{console.log(error)});
```
此时会启动框架内置的 Koa 服务器，允许用户通过 RESTful 接口来控制爬虫网络与获取当前状态。CrawlerServer 提供了 RESTful API 来返回当前爬虫的状态信息，我们可以利用 React 或者其他框架来快速搭建监控界面。

![](https://coding.net/u/hoteam/p/Cache/git/raw/master/2017/3/2/WX20170419-211515.png)


# 使用 declarative-crawler 抓取 Hacker News 列表与评论

# 使用 declarative-crawler 抓取知乎动态美女图片

# 使用 declarative-crawler 监控系统运行状态

# 使用 declarative-crawler 作为 ETL 数据迁移工具

