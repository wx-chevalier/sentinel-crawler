// @flow

import Crawler from "../../Crawler";
/**
 * @function 爬虫类型消息
 */
export default class CrawlerMessage {
  // 消息类型
  type: string;

  // 消息内容
  content: string;

  // 消息的发出者
  instance: Crawler;

  // 消息时间戳
  time: Date = new Date();

  /**
   * @function 默认构造函数
   * @param type
   * @param content
   * @param instance
   */
  constructor(type: string, instance: Crawler, content: string) {
    if (!type) {
      throw "必须指定消息类型";
    }

    this.type = type;

    instance && (this.instance = instance);

    content && (this.content = content);
  }
}

CrawlerMessage.REGISTER = "爬虫已注册";

CrawlerMessage.START = "爬虫已启动";

CrawlerMessage.ERROR = "爬虫出现异常";

CrawlerMessage.FINISH = "爬虫已结束";
