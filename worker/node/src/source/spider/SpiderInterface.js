/**
 * @function 蜘蛛接口定义
 */
export interface SpiderInterface {
  // 爬虫展示名
  displayName: string,

  // 模型属性
  model: ModelType,

  // 通过构造函数传入的外部信息
  extra: any,

  // 抓取函数
  fetch(...args: []): Promise<any>,

  // 提取函数
  extract(...args: []): Promise<Object>,

  // 解析函数
  parse(...args: []): Promise<any>,

  // 验证函数
  validate(...args: []): Promise<boolean>,

  // 数据存储
  persist(...args: []): Promise<boolean>,

  // 最终执行函数
  run(...args: []): Promise<boolean>
}
