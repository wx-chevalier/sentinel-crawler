// @flow

const Koa = require("koa");
const Router = require("koa-router");
import { dcEmitter, store } from "../crawler/monitor/DeclarativeCrawlerEmitter";
import CrawlerStatistics from "../crawler/monitor/entity/CrawlerStatistics";
import CrawlerScheduler from "../crawler/CrawlerScheduler";
const pusage = require("pidusage");
const os = require("os");
// Unmonitor process
// pusage.unmonitor(process.pid);
const app = new Koa();

const router = new Router();

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

  httpOption;

  /**
   * @function 默认构造函数
   * @param crawlerScheduler
   * @param httpOption
   */
  constructor(
    crawlerScheduler: CrawlerScheduler,
    httpOption = {
      host: "localhost",
      port: "3001"
    }
  ) {
    crawlerScheduler && (this.crawlerScheduler = crawlerScheduler);
    httpOption && (this.httpOption = httpOption);
  }

  async run() {
    // 默认路由，返回当前爬虫数目与状态
    router.get("/", function(ctx, next) {
      ctx.body = store.crawlers;
    });

    // 启动整个爬虫
    router.get("/start", (ctx, next) => {
      // 启动整个爬虫
      this.crawlerScheduler.run().then();

      // 返回结构
      ctx.body = {
        message: "OK"
      };
    });

    router.get("/status", async (ctx, next) => {
      ctx.body = await getOSInfo();
    });

    router.get("/:crawlerName", function(ctx, next) {
      // 获取到路径参数
      const { crawlerName } = ctx.params;

      let crawlerStatistics: CrawlerStatistics =
        store.crawlerStatisticsMap[crawlerName];

      if (!crawlerStatistics) {
        ctx.body = {
          error: "NOT FOUND"
        };
      } else {
        ctx.body = crawlerStatistics.spiders;
      }
    });

    // 使用预定义路由
    app.use(router.routes()).use(router.allowedMethods());

    app.listen(this.httpOption.port, this.httpOption.host, () => {
      console.log("服务端开始运行");
    });
  }
}
