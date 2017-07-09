// @flow

const Koa = require("koa");
const cors = require('kcors');
const Router = require("koa-router");
import { dcEmitter, store } from "../supervisor/singleton";
import CrawlerScheduler from "../source/crawler/CrawlerScheduler";
import CrawlerStatistics
  from "../supervisor/entity/CrawlerStatistics";
const pusage = require("pidusage");
const os = require("os");

const app = new Koa();

// 添加 CORS 支持
app.use(cors());

// 初始化路由设置
const router = new Router();

/**
 * Description 获取操作系统信息
 * @returns {Promise}
 */
async function getOSInfo() {
  return new Promise(resolve => {
    pusage.stat(process.pid, function(err, stat) {
      resolve({
        cpu: stat.cpu,
        memory: 1 - stat.memory / os.totalmem()
      });
    });
  });
}

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
      host: "0.0.0.0",
      port: 3001
    }
  ) {
    crawlerScheduler && (this.crawlerScheduler = crawlerScheduler);
    httpOption && (this.httpOption = httpOption);
  }

  async run() {
    // 默认路由，返回当前爬虫数目与状态
    router.get("/", function(ctx, next) {
      ctx.body = {
        message: "欢迎使用 Declarative Crawler Server！"
      };
    });

    router.get("/crawlers", function(ctx, next) {
      // store是DeclarativeCrawlerEmitter监听爬虫时存储的爬虫信息
      // store.crawlers存储字段：name，displayName，isRunning，lastStartTime，lastFinishTime，lastError
      ctx.body = store.crawlers;
    });

    // 启动整个爬虫
    // 这里不需要等待启动返回，因此直接使用 Promise 异步执行
    router.get("/start/:crawlerName", (ctx, next) => {
      // 获取到路径参数
      const { crawlerName } = ctx.params;

      if (crawlerName === "all") {
        // 启动整个爬虫
        this.crawlerScheduler.run().then();
      } else {
        // 启动指定名爬虫
        this.crawlerScheduler.run(crawlerName).then();
      }

      // 返回结构
      ctx.body = {
        message: "OK"
      };
    });

    // 返回爬虫目前状态
    router.get("/status", async (ctx, next) => {
      ctx.body = await getOSInfo();
    });

    // 根据crawlerName返回爬虫信息
    router.get("/crawler/:crawlerName", function(ctx, next) {
      // 获取到路径参数
      const { crawlerName } = ctx.params;

      let crawlerStatistics: CrawlerStatistics =
        store.crawlerStatisticsMap[crawlerName];

      if (!crawlerStatistics) {
        ctx.body = {
          error: "NOT FOUND"
        };
      } else {
        // spiders
        ctx.body = {
          // 剩余的请求数
          leftRequest: crawlerStatistics.instance._spiderTasks.length,
          spiders: crawlerStatistics.spiders
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
