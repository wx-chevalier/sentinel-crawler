const isNode = typeof process !== "undefined";

/**
 * @function 默认解析函数
 */
export function $(pageHTML?: string) {
  if (!pageHTML) {
    return null;
  }

  // 判断是否为 Node 环境，如果是则使用 cheerio 包，否则使用 jQuery
  if (isNode) {
    const cheerio = require("cheerio");

    let doc = cheerio.load(pageHTML, { decodeEntities: false });

    doc.find = doc;

    return doc;
  } else {
    // 判断 jQuery 是否存在
    if (window && window.$) {
      return window.$(pageHTML);
    } else {
      return null;
    }
  }
}
