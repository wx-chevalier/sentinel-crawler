// @flow

/**
 * Description 通用的请求对象
 */
export default class Request {
  /** 通用请求属性 */
  // 目标
  target: any;

  // 配置
  option: {
    [string]: any
  };

  // 其他全局信息
  extra: any;

  /** Web 专用属性 *
  url: string;

  /**
   * Description 判断输入的 Request 对象是否有效
   * @param request
   * @return {boolean}
   */
  static isValid(request: Object | Request) {

    if (request instanceof Request) {
      return !!this.target;
    } else {
      return !!request.url;
    }
  }
}

export type MixedRequestType = RequestType | Request;
