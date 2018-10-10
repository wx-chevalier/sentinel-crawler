# declarative-crawler

控制界面在线预览：http://ui.crawler.ggzy.truelore.cn/，测试用的爬虫服务器：http://server.crawler.ggzy.truelore.cn/ （目前需要手动填入）

declarative-crawler 是遵循声明式、可监测理念的分布式爬虫，其计划提供 Node.js、Go、Python 多种实现，能够对于静态 Web 页面、动态 Web 页面、关系型数据库、操作系统等异构多源数据进行抓取。不同语言的蜘蛛

declarative-crawler 希望让使用者专注于领域逻辑而不用考虑调度、监控等问题，并且稍加改造就能用于系统监控、ETL 数据迁移等领域。更多的 declarative-crawler 设计思想、设计规范参考下述文章：

- [浅论复杂智能爬虫的挑战与设计](./docs/Crawler.md)
- [declarative-crawler 设计思想与原则](./docs/Design.md)
- [CrawlerServer 接口规范](./docs/API.md)
- [监控界面设计规范](./docs/UI.md)

使用案例可以参考：

- [基于 Node.js 的声明式可监控爬虫网络初探](https://zhuanlan.zhihu.com/p/26463840)：本文是最早的设计思想与用例概述，其中使用的部分用例已经废弃，可以阅读了解下笔者的原始设计思想。
- [使用 declarative-crawler 爬取知乎美图](https://zhuanlan.zhihu.com/p/26691789)

# Nutshell

## Features

- Framework
- Standalone Deployment
- Master-Slave Deployment

## Components

- Request, 请求描述

- Fetcher, 请求执行器

- Spider, 单页面抓取与解析

- Crawler, 多页面抓取与解析

- Supervisor, 监控者

- Worker

- Scheduler, Master-Slave 架构

# About

## Credits

- [annie](https://github.com/iawia002/annie): A fast, simple and clean video downloader

### Golang

- [2015-go_spider #Project#](https://github.com/hu17889/go_spider): An awesome Go concurrent Crawler(spider) framework. The crawler is flexible and modular. It can be expanded to an Individualized crawler easily or you can use the default crawl components only.

- [2018-Muffet #Project#](https://github.com/raviqqe/muffet): Muffet is a website link checker which scrapes and inspects all pages in a website recursively.

* [2018-ferret #Project#](https://github.com/MontFerret/ferret): ferret is a web scraping system aiming to simplify data extraction from the web for such things like UI testing, machine learning and analytics.

## Roadmap

Next MileStone: 0.3

## Contributor
