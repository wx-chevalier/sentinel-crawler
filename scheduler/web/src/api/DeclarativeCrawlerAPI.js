// @flow
import { RequestBuilder, execute } from "fluent-fetcher";
import Crawler from "../entity/Crawler";

/**
 * Description 与服务端交互的 API
 */
export default class DeclarativeCrawlerAPI {
  // 内置的请求
  requestBuilder: RequestBuilder;

  /**
   * Description 动态设置请求地址
   * @param host
   * @param schema
   */
  setHost(host: string, schema = "http") {
    this.requestBuilder = new RequestBuilder({
      schema,
      host
    });
  }

  /**
   * Description 获取爬虫列表
   */
  async getCrawlers(): [Crawler] {
    // 如果尚未设置 Host 则留空
    if (!this.requestBuilder) {
      return [];
    }

    const { url } = this.requestBuilder.get("/crawlers").build();

    return await execute(url);
  }

  /**
   * Description 根据姓名获取爬虫详情
   * @returns {Promise.<void>}
   */
  async getCrawlerByName(): Crawler {}

  /**
   * Description 根据名称启动对应爬虫，all 则启动所有
   * @param crawlerName
   * @returns {Promise.<void>}
   */
  async startCrawlerByName(crawlerName: string) {
    // 如果尚未设置 Host 则留空
    if (this.requestBuilder) {
      const { url } = this.requestBuilder
        .get(`/start/${crawlerName}`)
        .build();

      await execute(url);
    }
  }

  /**
   * Description 获取操作系统信息
   * @returns {Promise.<void>}
   */
  async getOSInfo(): any {
    // 如果尚未设置 Host 则留空
    if (!this.requestBuilder) {
      return {
        cpu: 0,
        memory: 0
      };
    }

    const { url } = this.requestBuilder.get("/status").build();

    return await execute(url);
  }
}
