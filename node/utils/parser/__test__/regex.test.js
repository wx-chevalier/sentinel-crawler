// @flow

import { imageRegex } from "../regex";
const expect = require("chai").expect;

test("测试图片链接提取正则表达式", () => {
  const testStr = `&lt;img src="https://pic3.zhimg.com/440dd7778001bb0b79c71ab0788ad256_b.jpg" data-rawwidth="510" data-rawheight="661" class="origin_image zh-lightbox-thumb" width="510" data-original="https://pic3.zhimg.com/440dd7778001bb0b79c71ab0788ad256_r.jpg"&gt;这就是她们在大街上的感觉，这些裙子如果放在淘宝上，估计销量都不会太好，但是，她们的腿，她们的比例，她们的走路姿态，还有她们的身高带来的气势，已经掩盖住了所有的衣服本身的缺陷。`;

  const result = imageRegex.exec(testStr);

  expect(result[0]).to.equal(
    "https://pic3.zhimg.com/440dd7778001bb0b79c71ab0788ad256_b.jpg"
  );
});
