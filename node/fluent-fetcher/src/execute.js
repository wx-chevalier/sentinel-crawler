// @flow

//自动进行全局的ES6 Promise的Polyfill
require("es6-promise").polyfill();

/**
 * @function 根据传入的请求配置发起请求并进行预处理
 * @param url
 * @param option
 * @param {*} acceptType text | json | xml
 */
export default function execute(
  url: string,
  option: any = {},
  acceptType: string = "json"
): Promise<any> {
  if (!url) {
    throw new Error("地址未定义");
  }

  // 引入 fetch polyfill
  require("isomorphic-fetch");

  //构建fetch请求
  return fetch(url, option)
    .then(
      response => _checkStatus(response, acceptType),
      error => {
        throw error;
      }
    )
    .then(acceptType === "json" ? _parseJSON : _parseText, error => {
      throw error;
    });
}

/**
 * @function 检测返回值的状态
 * @param response
 * @param acceptType
 * @returns {*}
 */
async function _checkStatus(response, acceptType) {
  if (
    (response.status >= 200 && response.status < 300) || response.status === 0
  ) {
    return response;
  } else {
    // 获取响应体
    let body = acceptType === "json"
      ? await response.json()
      : await response.text();

    // 封装并且抛出错误对象
    throw new Error(
      JSON.stringify({
        status: response.status,
        statusText: response.statusText,
        body: body
      })
    );
  }
}

/**
 * @function 解析返回值中的Response为JSON形式
 * @param response
 * @returns {*}
 */
function _parseJSON(response) {
  if (!!response) {
    return response.json();
  } else {
    return {};
  }
}

/**
 * @function 解析TEXT性质的返回
 * @param response
 * @returns {*}
 */
function _parseText(response: Response): Promise<string> | string {
  if (!!response) {
    return response.text();
  } else {
    return "";
  }
}

/**
 * @function 判断是否为Weapp
 * @private
 * @return boolean
 */
function _isWeapp(): boolean {
  return typeof window.wx !== "undefined";
}
