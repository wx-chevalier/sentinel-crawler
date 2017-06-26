// @flow
import Spider from "../../../../source/spider/Spider";
/**
 * @function 默认全局的状态存储
 */
export class SpiderStatistics {
  // 爬虫名与信息
  instance: Spider;

  // 最后一次运行时间
  lastActiveTime: Date;

  // 平均总执行时间 / ms
  executeDuration: number = 0;

  // 爬虫次数统计
  count: number = 0;

  // 异常次数统计
  errorCount: number = 0;

  // 时序执行次数
  countByTime: { [number]: number } = {};

  /**
   * @function 默认构造函数
   * @param instance
   * @param lastActiveTime
   */
  constructor(instance, lastActiveTime) {
    instance && (this.instance = instance);
    lastActiveTime && (this.lastActiveTime = lastActiveTime);

    // 初始化时序统计信息
    for (let i = 0; i < 60; i++) {
      this.countByTime[i] = 0;
    }
  }

  /**
   * @function 增加一次爬取次数
   * @param time
   */
  incrementCount = (time?: Date) => {
    this.count = this.count + 1;
    if (time) {
      this.countByTime[time.getMinutes()] += 1;
      this.lastActiveTime = time;
    }
  };

  /**
   * @function 更新爬虫的评价执行时长
   * @param duration
   */
  updateExecuteDuration(duration: number) {
    if (this.executeDuration === 0) {
      this.executeDuration = duration;
    } else {
      this.executeDuration = (duration + this.executeDuration) / 2;
    }
  }
}
