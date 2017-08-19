// @flow

import type { MixedRequestType } from '../spider/Request';
import Spider from '../spider/Spider';
import type { Transformer } from './Crawler';

/**
 * Description 蜘蛛任务执行与统计
 */
export default class SpiderTask {
  /** 构造函数需要输入的属性 */
  spiderInstance: Spider;

  request: MixedRequestType;

  transformer: Transformer;

  nextSpiderInstance: Spider;

  /** 内部运行时属性 */
  error: Error;

  // 本任务的执行开始时间
  startTime: Date;

  // 本任务的执行时间
  elapsedTime: number;

  /**
   * 默认构造函数
   */
  constructor(
    spiderInstance: Spider,
    request: MixedRequestType,
    transformer: Transformer,
    nextSpiderInstance: Spider
  ) {
    this.spiderInstance = spiderInstance;

    this.request = request;

    this.transformer = transformer;

    this.nextSpiderInstance = nextSpiderInstance;
  }

  /**
   * Description 执行该任务
   * @return {Promise.<void>}
   */
  async run(isPersist: boolean): Promise<Array<MixedRequestType>> {
    const { url, option, extra } = this.request;

    // 设置爬虫的请求
    this.spiderInstance.setRequest(url, option);

    // 判断上一次发出的请求中是否附带有额外的 extra 信息
    if (extra) {
      this.spiderInstance.setExtra(extra);
    }

    this.startTime = new Date();

    let data,
      derivedRequests: Array<MixedRequestType> = [];

    try {
      // 执行当前任务
      data = await this.spiderInstance.run(isPersist);

      // 记录本次执行时间
      this.elapsedTime = Date.now() - this.startTime;
    } catch (e) {
      this.error = e;

      // 发生异常时，跳过剩余的执行
      throw e;
    }

    // 设置新的爬虫
    if (this.transformer && this.nextSpiderInstance) {
      // 根据转换器获取新的请求
      let newRequests = this.transformer(data);

      return newRequests.map((rawRequest: MixedRequestType | any) => {
        // 判断 request 是字符串还是 URL
        if (typeof rawRequest === 'string') {
          return {
            url: rawRequest
          };
        } else {
          return rawRequest;
        }
      });
    } else {
      return [];
    }
  }
}

/**
 * Description 将输入的请求映射为蜘蛛任务
 * @param requests
 * @param spiders
 * @param transforms
 */
SpiderTask.map = (
  requests: Array<MixedRequestType>,
  spiders: Array,
  transforms: Array
): Array<SpiderTask> => {
  return requests.map(request => {
    return new SpiderTask(
      spiders[0],
      request,
      transforms.length > 0 ? transforms[0] : null,
      spiders.length > 1 ? spiders[1] : null
    );
  });
};
