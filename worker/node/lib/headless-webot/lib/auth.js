// @flow
import { execute } from "fluent-fetcher";
import {
  checkLoginUrl,
  checkScanUrl,
  userCache,
  uuidUrl,
  wait
} from "./config";
// 登录相关函数

/**
 * Description 获取用户登录所需的 UUID
 * @returns {Promise.<*>}
 */
export async function getUUID() {
  let res: string = await execute(uuidUrl, {}, "text");

  let uuid = res.split('"')[1];

  // 设置 uuid
  userCache.uuid = uuid;

  return uuid;
}

/**
 * Description 等待用户是否扫描
 * @returns {Promise.<boolean>}
 */
export async function waitUserScanAndLogin() {
  console.log("等待扫描中！");
  let res: string = await execute(checkScanUrl(userCache.uuid), {}, "text");

  if (res && res.indexOf("window.code=201;") >= 0) {
    console.log("扫描完毕！");

    while (true) {
      let text: string = await execute(
        checkLoginUrl(userCache.uuid),
        {},
        "text"
      );

      if (
        text &&
        text.indexOf("window.code=200;") >= 0 &&
        text.indexOf("window.redirect_uri") >= 0
      ) {
        // 将数据存放到缓存中
        userCache.redirectUri = text.split('"')[1];
        userCache.baseUri = userCache.redirectUri.substring(
          0,
          res.redirectUri.lastIndexOf("/")
        );

        return true;
      } else {
        wait(500);
      }
    }
  } else {
    return false;
  }
}
