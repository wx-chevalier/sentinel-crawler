// @flow

import PostsSpider from '../PostsSpider';

test('测试抓取博客并且进行校验', async done => {
  let postsSpider: PostsSpider = new PostsSpider().setRequest(
    'https://jsonplaceholder.typicode.com/posts'
  );

  await postsSpider.run(false);
  done();
});

test('测试抓取错误博客并且可以抛出异常', async done => {
  let postsSpiderWithWrongUrl: PostsSpider = new PostsSpider().setRequest(
    'https://jsonplaceholder.typicode.com/posts.wrong'
  );

  try {
    await postsSpiderWithWrongUrl.run(false);
  } catch (e) {
    expect(JSON.parse(e.message)).toHaveProperty('status', 404);
  } finally {
    done();
  }
});

test('测试抓取博客并且进行错误校验', async done => {
  let postsSpider: PostsSpider = new PostsSpider().setRequest(
    'https://jsonplaceholder.typicode.com/posts'
  );

  postsSpider.validate = (parsedData, expect) => {
    expect(parsedData, '列表长度应该大于 0').to.have.lengthOf(0);
  };

  try {
    await postsSpider.run(false);
  } catch (e) {
    expect(e.message).toEqual(
      '列表长度应该大于 0: expected [ Array(100) ] to have a length of 0 but got 100'
    );
  } finally {
    done();
  }
});
