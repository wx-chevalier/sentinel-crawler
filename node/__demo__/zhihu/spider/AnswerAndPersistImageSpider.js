// @flow

import HeadlessChromeSpider from "../../../spider/web/HeadlessChromeSpider";
import { downloadPersistor } from "../../../utils/persist/DownloadPersistor";
export default class AnswerAndPersistImageSpider extends HeadlessChromeSpider {
  // 定义模型
  model = {
    $imgs: "img"
  };

  async parse(pageElement: any, $: Element): any {
    let imgs = [];

    for (let i = 0; i < pageElement["$imgs"].length; i++) {
      let $img = $(pageElement["$imgs"][i]);

      imgs.push($img.attr("src"));
    }

    return imgs;
  }

  async persist(imgs) {
    await downloadPersistor.saveImage(imgs);
  }
}
