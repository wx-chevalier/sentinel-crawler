var cheerio = require("cheerio");

/**
 * @function 默认解析函数
 */
export function $(pageHTML: string) {
    
  let doc = cheerio.load(pageHTML, { decodeEntities: false });

  doc.find = doc;

  return doc;
}
