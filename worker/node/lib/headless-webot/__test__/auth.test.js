// @flow
const qrcode = require("qrcode-terminal");
import { getUUID, waitUserScanAndLogin } from "../lib/auth";
import { userCache } from "../lib/config";

async function test() {
  await getUUID();

  // 在控制台展示
  qrcode.generate(`https://login.weixin.qq.com/l/${userCache.uuid}`);

  // 等待用户扫描二维码并且登录
  await waitUserScanAndLogin();
}

test().then();
