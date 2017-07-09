// @flow
// 微信关键 URL 定义

/**
 * Description 获取时间戳
 * @returns {string}
 */
export function getTimestamp() {
  return ("" + Math.random().toFixed(15)).substring(2, 17);
}

/**
 * Description 等待 500 毫秒
 * @param timeout
 * @returns {Promise}
 */
export function wait(timeout: number) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 500);
  });
}

// 定义获取 UUID 的链接
export const uuidUrl = `https://login.wx.qq.com/jslogin?appid=wx782c26e4c19acffb&redirect_uri=https%3A%2F%2Fwx.qq.com%2Fcgi-bin%2Fmmwebwx-bin%2Fwebwxnewloginpage&fun=new&lang=zh_CN&_=${getTimestamp()}`;

// 获取二维码链接
export const qrcodeUrl = uuid => `https://login.weixin.qq.com/l/${uuid}`;

export const checkScanUrl = uuid =>
  `https://login.wx.qq.com/cgi-bin/mmwebwx-bin/login?loginicon=false&uuid=${uuid}&tip=0&_=${getTimestamp()}`;

export const checkLoginUrl = uuid =>
  `https://login.wx.qq.com/cgi-bin/mmwebwx-bin/login?uuid=${uuid}&tip=1&_=${getTimestamp()}`;

// 汇报链接
export const statReportUrl = "/webwxstatreport?type=1&r=1455625522";

export const userCache = {};
