// @flow

import CrawlerScheduler from '../source/crawler/CrawlerScheduler';
import CrawlerReporter from './util/reporter/CrawlerReporter';
import RuntimeInfoService from './service/RuntimeInfoService';
import Crawler from '../source/crawler/Crawler';

const Koa = require('koa');
const cors = require('kcors');
const Router = require('koa-router');

const app = new Koa();

// 添加 CORS 支持
app.use(cors());

// 初始化路由设置
const router = new Router();

/**
 * @function 爬虫运行服务器
 */
export default class CrawlerServer {
  crawlerScheduler: CrawlerScheduler;

  httpOption: any;

  /**
   * @function 默认构造函数
   * @param crawlerScheduler
   * @param httpOption
   */
  constructor(
    crawlerScheduler: CrawlerScheduler,
    httpOption: {
      host: string,
      port: number
    } = {
      host: '0.0.0.0',
      port: 3001
    }
  ) {
    crawlerScheduler && (this.crawlerScheduler = crawlerScheduler);
    httpOption && (this.httpOption = httpOption);
  }

  async run() {
    // 默认路由，返回当前爬虫数目与状态
    router.get('/', (ctx, next) => {
      ctx.body = {
        message: '欢迎使用 Declarative Crawler Server！'
      };
    });

    router.get('/crawlers', (ctx, next) => {
      ctx.body = CrawlerReporter.getCrawlerListStatistics(
        this.crawlerScheduler
      );
    });

    // 启动整个爬虫
    // 这里不需要等待启动返回，因此直接使用 Promise 异步执行
    router.get('/start/:crawlerName', (ctx, next) => {
      // 获取到路径参数
      const { crawlerName } = ctx.params;

      if (crawlerName === 'all') {
        // 启动整个爬虫
        this.crawlerScheduler.run().then();
      } else {
        // 启动指定名爬虫
        this.crawlerScheduler.run(crawlerName).then();
      }

      // 返回正常启动信息
      ctx.body = {
        message: 'OK'
      };
    });

    // 返回爬虫目前状态
    router.get('/status', async (ctx, next) => {
      ctx.body = await RuntimeInfoService.getOSInfo();
    });

    // 根据crawlerName返回爬虫信息
    router.get('/crawler/:crawlerName', (ctx, next) => {
      // 获取到路径参数
      const { crawlerName } = ctx.params;

      let crawler: Crawler = this.crawlerScheduler.crawlers[crawlerName];

      if (!crawler) {
        ctx.body = {
          error: 'NOT FOUND'
        };
      } else {
        // spiders
        ctx.body = {
          // 剩余的请求数
          waitingSpiderTaskNum: crawler.waitingSpiderTasks.length,
          spiders: CrawlerReporter.getSpiderListStatisticsByName(crawler)
        };
      }
    });

    // 使用预定义路由
    app.use(router.routes()).use(router.allowedMethods());

    app.listen(this.httpOption.port, this.httpOption.host, () => {
      const baseUrl = `${this.httpOption.host}:${this.httpOption.port}`;

      console.log(
        `
          爬虫服务端开始运行：
          ${baseUrl}/ - 服务端根入口
          ${baseUrl}/crawlers - 查看爬虫列表
          ${baseUrl}/crawler/:crawlerName - 查看某个爬虫详情
          ${baseUrl}/start/all - 启动所有爬虫
          ${baseUrl}/start/:crawlerName - 启动所有爬虫
          ${baseUrl}/status - 查看系统状态
        `
      );
    });
  }
}
