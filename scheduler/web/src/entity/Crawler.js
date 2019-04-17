// @flow
import { entityProperty } from "swagger-decorator";

/**
 * Description 爬虫数据信息
 */
export default class Crawler {
  @entityProperty({
    description: "爬虫名"
  })
  name: string;

  @entityProperty({
    description: "爬虫描述名"
  })
  displayName: string;

  @entityProperty({
    description: "爬虫是否正在运行",
    type: "boolean"
  })
  isRunning: boolean;

  @entityProperty({
    description: "已经执行的蜘蛛任务数"
  })
  executedSpiderTaskNum: number;

  @entityProperty({
    description: "等待执行的蜘蛛任务数"
  })
  leftSpiderTaskNum: number;

  @entityProperty({
    description: "最后启动时间"
  })
  lastStartTime: Date;

  @entityProperty({
    description: "最后结束时间"
  })
  lastFinishTime: Date;

  @entityProperty({
    description: "最后一条错误信息"
  })
  lastErrorMessage: string;
}
