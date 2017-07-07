// @flow

/**
 * @function 公共消息类型定义
 */
export default class SpiderMessage {
  // 消息类型
  type: string;

  // 消息内容
  content: string;

  // 消息的发出者
  instance: Spider;

  // 消息时间戳
  time: Date = new Date();

  /**
   * @function 默认构造函数
   * @param type
   * @param content
   * @param instance
   */
  constructor(type: string, instance: Spider, content: string = "") {
    if (!type) {
      throw "必须指定消息类型";
    }

    this.type = type;

    instance && (this.instance = instance);

    content && (this.content = content);
  }
}

// 蜘蛛生命周期

SpiderMessage.START_FETCH = "开始抓取";

SpiderMessage.FINISH_FETCH = "结束抓取";

SpiderMessage.START_PARSE = "开始解析";

SpiderMessage.FINISH_PARSE = "结束解析";

SpiderMessage.START_PERSIST = "开始存储";

SpiderMessage.FINISH_PERSIST = "结束存储";

// 蜘蛛运行时间统计

SpiderMessage.LOG_EXECUTE_DURATION = "执行时间";

// 蜘蛛校验数据统计
SpiderMessage.VALIDATE_OK = "校验成功";

SpiderMessage.VALIDATE_FAILURE = "校验失败";
