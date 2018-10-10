// @flow

/** HTML 页面解析的模型 */
declare type ModelType = {
  [string]: string | ModelType
};

/** 请求类型 */
declare type RequestType = {
  // 请求地址
  url: string,

  // fetch 使用的配置
  option: { [string]: any }
};

/** 蜘蛛状态 */
declare type SpiderStatus =
  | 'IDLE' // 进入空闲状态
  | 'FETCH' // 进入抓取状态
  | 'PARSE' // 进入解析状态
  | 'VALIDATE' // 进入校验状态
  | 'PERSIST'; // 进入持久化存储
