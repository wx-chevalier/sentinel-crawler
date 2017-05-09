// @flow

import HeadlessChromeSpider from "../../../src/spider/web/HeadlessChromeSpider";
import {
  downloadPersistor
} from "../../../src/utils/persist/DownloadPersistor";
import { imageRegex } from "../../../src/utils/parser/regex";

/**
 * @function 专门用于爬取答案以及缓存的爬虫
 */
export default class AnswerAndPersistImageSpider extends HeadlessChromeSpider {
  // 定义模型
  model = {
    // 抓取所有的默认
    $imgs: "img",

    // 抓取所有的延迟加载的大图
    $noscript: "noscript"
  };

  /**
   * @function 对提取出的页面对象进行解析
   * @param pageElement 存放页面对象
   * @param $ 整个页面的 DOM 表示
   * @returns {Promise.<Array>}
   */
  async parse(pageElement: any, $: Element): any {
    // 存放所有图片
    let imgs = [];

    // 抓取所有默认图片
    for (let i = 0; i < pageElement["$imgs"].length; i++) {
      let $img = $(pageElement["$imgs"][i]);

      imgs.push($img.attr("src"));
    }

    // 抓取所有 noscript 中包含的图片
    for (let i = 0; i < pageElement["$noscript"].length; i++) {
      // 执行地址提取
      let regexResult = imageRegex.exec($(pageElement["$noscript"][i]).text());

      if (regexResult) {
        imgs.push(regexResult[0]);
      }
    }

    return imgs;
  }

  /**
   * @function 执行持久化操作
   * @param imgs
   * @returns {Promise.<void>}
   */
  async persist(imgs) {
    await downloadPersistor.saveImage(imgs);
  }
}
