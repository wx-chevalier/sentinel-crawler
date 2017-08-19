// @flow

import Crawler from '../../../src/source/crawler/Crawler';
import PostsSpider from '../spider/api/PostsSpider';
import CommentsSpider from '../spider/api/CommentsSpider';

export default class APICrawler extends Crawler {
  // 初始化爬虫

  initialize() {
    // 构建所有的爬虫
    let requests = [{ url: 'https://jsonplaceholder.typicode.com/posts' }];

    this.setRequests(requests)
      .setSpider(new PostsSpider())
      .transform(posts => {
        if (!Array.isArray(posts)) {
          throw new Error('爬虫连接失败！');
        }
        return posts.map(post => {
          return `https://jsonplaceholder.typicode.com/comments/${post.id}`;
        });
      })
      .setSpider(new CommentsSpider());
  }
}
