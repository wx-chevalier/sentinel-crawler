// @flow

export interface APIClientInterface {
  // 请求的域地址
  host: string,

  // 需要覆写的返回自定义请求头，包含认证信息等内容的函数
  getCustomHeaders(): { [string]: string }
}

export default class APIClient {
  scheme = "http";
  host = "";

  /**
   * @function 默认构造函数
   */
  constructor() {}

  getCustomHeaders(): { [string]: string } {
    return {};
  }

  get(path = "/", params = {}) {}

  post(path = "/", params = {}) {}

  put(path = "/", params = {}) {}
}
