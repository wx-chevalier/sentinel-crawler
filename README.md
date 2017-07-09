
# declarative-crawler

控制界面在线预览：http://ui.crawler.ggzy.truelore.cn/，测试用的爬虫服务器：http://server.crawler.ggzy.truelore.cn/ （目前需要手动填入）

declarative-crawler 是遵循声明式、可监测理念的分布式爬虫，其计划提供 Node.js 与 Go 两种实现，能够对于静态 Web 页面、动态 Web 页面、关系型数据库、操作系统等异构多源数据进行抓取。declarative-crawler 希望让使用者专注于领域逻辑而不用考虑调度、监控等问题，并且稍加改造就能用于系统监控、ETL 数据迁移等领域。更多的 declarative-crawler 设计思想、设计规范参考下述文章：
- [浅论复杂智能爬虫的挑战与设计](./docs/Crawler.md)
- [declarative-crawler 设计思想与原则](./docs/Design.md)
- [CrawlerServer 接口规范](./docs/API.md)
- [监控界面设计规范](./docs/UI.md)

使用案例可以参考：
- [基于 Node.js 的声明式可监控爬虫网络初探](https://zhuanlan.zhihu.com/p/26463840)：本文是最早的设计思想与用例概述，其中使用的部分用例已经废弃，可以阅读了解下笔者的原始设计思想。
- [使用 declarative-crawler 爬取知乎美图](https://zhuanlan.zhihu.com/p/26691789)


# Usage

## 爬取单页面的 Spider

## 调度多个 Spider 的 Crawler

## 调度多个 Crawler 的 CrawlerScheduler

## 使用 CrawlerServer 以服务端方式运行爬虫网络

## 使用 CrawlerUI 可视化监控爬虫运行状态

# Spider 类型介绍

## Spider 定义

## Web Spider

## OS Spider

## DB Spider