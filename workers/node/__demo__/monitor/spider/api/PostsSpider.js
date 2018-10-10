// @flow
import JSONSpider from '../../../../src/source/spider/web/JSONSpider';
import CommentsSpider from './CommentsSpider';

/**
 * Description 抓取博客数据
 */
export default class PostsSpider extends JSONSpider {
  displayName = '文章';

  dependencies = [CommentsSpider];

  /**
   * Description 执行数据校验操作
   * @param parsedData
   * @param expect
   */
  validate(parsedData, expect) {
    expect(parsedData, '列表长度应该大于 0').to.have.lengthOf.above(0);
    expect(parsedData[0], '列表中的每个 POST 应该是对象').to.be.an('object');
    expect(parsedData[0]).to.have.property('userId');
    expect(parsedData[0]).to.have.property('id');
    expect(parsedData[0]).to.have.property('title');
    expect(parsedData[0]).to.have.property('body');
  }
}
