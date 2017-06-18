// @flow

export type RequestType = {
  // 请求地址
  url: string,

  // fetch 使用的配置
  option: { [string]: any }
};
