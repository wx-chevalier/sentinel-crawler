// @flow

import { override } from "core-decorators";
import type { SpiderInterface } from "../SpiderInterface";
import Spider from "../Spider";
import { execute } from "fluent-fetcher";

/**
 * Description 简单的 JSON 爬虫
 */
export default class JSONSpider extends Spider implements SpiderInterface {
  /**
   * Description 数据抓取
   * @param url
   * @param option
   * @returns {Promise}
   */
  @override
  async fetch(url: string, option: Object): Promise<any> {
    // 执行抓取操作，最多一分钟，如果超时则会抛出异常
    return await execute(url, option, "json", {
      timeout: 60 * 1000
    });
  }
}
