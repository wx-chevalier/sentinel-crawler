// @flow
import { override } from 'core-decorators';
import type { SpiderInterface } from '../SpiderInterface';
import Spider from '../Spider';
import { execute } from 'fluent-fetcher';

/**
 * Description 简单的基于 HTTP 的爬虫
 */
export default class TextSpider extends Spider implements SpiderInterface {
  /**
   * Description 数据抓取
   * @param url
   * @param option
   * @returns {Promise}
   */
  @override
  async fetch(url: string, option: Object): Promise<any> {
    return new Promise(async (resolve, reject) => {
      // 设置抓取过时，最多 1 分钟
      setTimeout(() => {
        reject(
          new Error(
            JSON.stringify({
              spiderName: this.name,
              message: '抓取超时',
              url: this.url,
              time: new Date()
            })
          )
        );
      }, 60 * 1000);

      resolve(await execute(url, option, 'text'));
    });
  }

  /**
   * Description 元素提取函数
   * @param pageHTML
   * @param model 在 TextSpider 中传入的即为 undefined
   * @returns {Promise.<{}>}
   */
  @override
  async extract(pageHTML: string, model: ModelType): string {
    return pageHTML;
  }
}
