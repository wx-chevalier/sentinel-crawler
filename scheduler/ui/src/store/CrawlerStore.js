// @flow
import { observable, action } from "mobx";
import Crawler from "../entity/Crawler";
import DeclarativeCrawlerAPI from "../api/DeclarativeCrawlerAPI";

export default class CrawlerStore {
  declarativeCrawlerAPI: DeclarativeCrawlerAPI;

  // 爬虫列表
  @observable crawlers: [Crawler];

  // 系统状态
  @observable osInfo;

  /**
   * Description 默认构造函数
   * @param declarativeCrawlerAPI
   */
  constructor(declarativeCrawlerAPI: DeclarativeCrawlerAPI) {
    this.declarativeCrawlerAPI = declarativeCrawlerAPI;
  }

  @action async setHost(host: string) {
    this.declarativeCrawlerAPI.setHost(host);

    await this.loadHomeInfo();
  }

  /**
   * Description 加载爬虫数据
   * @returns {Promise.<void>}
   */
  @action async loadHomeInfo() {
    // 加载系统状态
    this.osInfo = await this.declarativeCrawlerAPI.getOSInfo();

    // 加载爬虫
    this.crawlers = await this.declarativeCrawlerAPI.getCrawlers();

    // 加载错误日志
  }

  /**
   * Description 根据名称启动爬虫
   * @param crawlerName
   * @returns {Promise.<void>}
   */
  @action async startCrawler(crawlerName: string) {
    await this.declarativeCrawlerAPI.startCrawlerByName(crawlerName);
    await this.loadHomeInfo();
  }
}
