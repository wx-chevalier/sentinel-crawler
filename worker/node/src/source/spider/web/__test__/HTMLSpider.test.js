// @flow
import HTMLSpider from '../HTMLSpider';

describe('测试 HTMLSpider 的解析函数', () => {
  test('测试表格解析', async () => {
    let spider = new HTMLSpider();

    spider.model = {
      // 标题
      $title: '.ewb-sales-tt h2',

      // 交易进程表格
      $table: '.ewb-sales-info > table[id="detailcontent"]',

      // 表格
      $status: '.ewb-status-bd'
    };

    spider.parse = (pageElements, $) => {
      // 标题
      let title = pageElements.$title.text().trim();

      let $table = pageElements.$table;

      console.log($table.find('.ewb-info-name'));

      Array.prototype.forEach.call($table.find('tr'), (tr, i) => {
        console.log(i);
      });

      return {
        title: title
      };
    };

    spider.setRequest(
      'http://49.65.0.196/njweb/salesCourse.html?type=zfcg&BiaoDuanGuid=2c20871c-835c-4dc4-8a9f-28ec68a9d668'
    );

    await spider.run(false);
  });
});
