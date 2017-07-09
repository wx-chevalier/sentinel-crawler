// @flow
import { override } from "core-decorators";
import type { SpiderInterface } from "../SpiderInterface";
import Spider from "../Spider";
import { execute } from "fluent-fetcher";
const $ = require("isomorphic-parser");

/**
 * Description 简单的基于 HTTP 的爬虫
 */
export default class HTMLSpider extends Spider implements SpiderInterface {
  /**
   * Description 数据抓取
   * @param url
   * @param option
   * @returns {Promise}
   */
  @override async fetch(url: string, option: Object): Promise<any> {
    return new Promise(async (resolve, reject) => {
      // 设置抓取过时，最多 1 分钟
      setTimeout(() => {
        reject(
          new Error(
            JSON.stringify({
              spiderName: this.name,
              message: "抓取超时",
              url: this.url,
              time: new Date()
            })
          )
        );
      }, 60 * 1000);

      resolve(await execute(url, option, "text"));
    });
  }

  /**
   * Description 元素提取函数
   * @param pageHTML
   * @param model
   * @returns {Promise.<{}>}
   */
  @override async extract(
    pageHTML: string,
    model: ModelType
  ): {
    data: Object,
    $: Element
  } {
    let pageObject = {};

    // 执行数据抽取
    let $dom = $(pageHTML);

    for (let key in model) {
      // 如果是非自身属性则跳过
      if (!model.hasOwnProperty(key)) {
        continue;
      }

      // 如果键的起始字符为 $ ，则直接提取
      if (key[0] === "$") {
        // 判断是否为指向自身的
        if (model[key] === "self") {
          pageObject[key] = $dom;
        } else {
          pageObject[key] = $($dom.find(model[key]));
        }
        continue;
      }

      // 其余情况表示此时为选择器，则分层提取
      let $elementOrElements = $dom.find(key);

      // 判断是否为数组或者单个值
      if ($elementOrElements.length && $elementOrElements.length > 0) {
        // 如果为数组则返回数组
        let elementsLength = $elementOrElements.length;

        // 提取到的目标对象
        let $elementsObject = [];

        // 遍历所有提取到的一级元素
        for (let i = 0; i < elementsLength; i++) {
          let $element = $($elementOrElements[i]);
          let elementObject = {};

          // 遍历所有的二级键
          for (let subKey of Object.keys(model[key])) {
            if (model[key][subKey] === "self") {
              elementObject[subKey] = $element;
            } else {
              // Todo 这里有可能获取到的仍然是某个数组对象
              elementObject[subKey] = $($element.find(model[key][subKey]));
            }
          }

          // 将封装好的数据放置到数组中
          $elementsObject.push(elementObject);
        }

        pageObject[key] = $elementsObject;
      } else {
        pageObject[key] = [];

        // 不为数组则返回单个值
        // 遍历所有的二级键
        for (let subKey of Object.keys(model[key])) {
          if (model[key][subKey] === "self") {
            pageObject[key][subKey] = $($elementOrElements);
          } else {
            pageObject[key][subKey] = $(
              $($elementOrElements).find(model[key][subKey])
            );
          }
        }
      }
    }

    return {
      data: pageObject,
      $
    };
  }
}
