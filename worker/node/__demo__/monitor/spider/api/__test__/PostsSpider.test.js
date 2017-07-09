// @flow

import PostsSpider from "../PostsSpider";

let postsSpider: PostsSpider = new PostsSpider().setRequest(
  "https://jsonplaceholder.typicode.com/posts"
);

let postsSpiderWithWrongUrl: PostsSpider = new PostsSpider().setRequest(
  "https://jsonplaceholder.typicode.com/posts.wrong"
);

test("测试抓取博客并且进行校验", async () => {
  await postsSpider.run(false);
});

test("测试抓取错误博客并且可以抛出异常", async () => {
  try {
    await postsSpiderWithWrongUrl.run(false);
  } catch (e) {
    expect(JSON.parse(e.message)).toHaveProperty("status", 404);
  }
});
