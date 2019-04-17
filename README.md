# xe-crawler

xe-crawler 是遵循声明式、可监测理念的分布式爬虫，其计划提供 Node.js、Go、Python 多种实现，能够对于静态 Web 页面、动态 Web 页面、关系型数据库、操作系统等异构多源数据进行抓取。xe-crawler 希望让使用者专注于领域逻辑而不用考虑调度、监控等问题，并且稍加改造就能用于系统监控、ETL 数据迁移等领域。更多的 xe-crawler 设计思想、设计规范参考[]()系列文章。

使用案例可以参考：

- [基于 Node.js 的声明式可监控爬虫网络初探](https://zhuanlan.zhihu.com/p/26463840)：本文是最早的设计思想与用例概述，其中使用的部分用例已经废弃，可以阅读了解下笔者的原始设计思想。
- [使用 xe-crawler 爬取知乎美图](https://zhuanlan.zhihu.com/p/26691789)

# Usage & Development

## Headless Chrome & Puppetter Wrapper | 直接使用独立的 Puppetter 封装体

## Standalone Crawler Framework | 单个爬虫框架的独立使用

# Deployment with Supervisor | 带调度节点的集群化部署

# About

## Credits

- [annie](https://github.com/iawia002/annie): A fast, simple and clean video downloader

### Golang

- [2015-go_spider #Project#](https://github.com/hu17889/go_spider): An awesome Go concurrent Crawler(spider) framework. The crawler is flexible and modular. It can be expanded to an Individualized crawler easily or you can use the default crawl components only.

- [2018-Muffet #Project#](https://github.com/raviqqe/muffet): Muffet is a website link checker which scrapes and inspects all pages in a website recursively.

* [2018-ferret #Project#](https://github.com/MontFerret/ferret): ferret is a web scraping system aiming to simplify data extraction from the web for such things like UI testing, machine learning and analytics.
