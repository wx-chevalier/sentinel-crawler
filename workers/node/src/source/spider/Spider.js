// @flow
import type { SpiderInterface } from './SpiderInterface';

const chaiExpect = require('chai').expect;
const nanoid = require('nanoid');

/**
 * Description 蜘蛛中心定义类
 *
 * *Error Handling* 在生产环境下，蜘蛛应该由爬虫统一调度，因此蜘蛛并不需要在本层进行容错，而应该直接抛出异常
 *
 */
export default class Spider implements SpiderInterface {
  /** @region 自定义属性 */
  // 唯一编号
  uuid: string = nanoid();

  // 当前类名
  name: string = this.constructor.name;

  /** @region 继承方式声明的属性 */
  // 组件名
  displayName: string = 'Spider';

  // 模型定义
  model: ModelType = {};

  // 蜘蛛依赖图谱
  dependencies: Array<Spider> = [];

  /** @region 构造函数方式传入的属性 */
  // 通过构造函数传入，额外信息
  extra: any;

  /** @region 允许动态设置的属性 */
  url: string;

  option = {};

  /** @region 内部状态属性 */
  /** 爬虫当前状态 */
  status: SpiderStatus = 'IDLE';

  /** 爬虫的执行时间记录 */
  elapsedTime: {
    fetch: number,
    parse: number,
    validate: number,
    persist: number
  } = {
    fetch: -1,
    parse: -1,
    validate: -1,
    persist: -1
  };

  // 方法定义
  /**
   * @function 构造函数
   */
  constructor(extra?: any) {
    extra && (this.extra = extra);
  }

  /**
   * @param url
   * @param option
   * @returns {Spider}
   */
  setRequest(url: string, option: Object): Spider {
    // 设置路径与配置
    url && (this.url = url);
    option && (this.option = option);

    return this;
  }

  /**
   * Description 设置当前蜘蛛的额外信息，额外信息一部分是初始化时候的静态配置，一部分来源于上一个蜘蛛的动态信息
   * @param extra
   */
  setExtra(extra?: any) {
    extra && (this.extra = Object.assign({}, this.extra, extra));
    return this;
  }

  /**
   * Description 数据抓取
   */
  async fetch(url: string, option: Object): Promise<any> {
    return null;
  }

  /**
   * Description 数据提取之前的预处理
   * @param {*} rawData
   */
  before_extract(rawData: any): string {
    return rawData;
  }

  // 数据提取
  async extract(rawData: any, model: ModelType): Promise<Object> {
    // 如果是 HTMLSpider 中，则是返回 {data, $dom}
    return rawData;
  }

  // 数据解析
  async parse(extractedData: { [string]: any }, $?: Element): Promise<any> {
    return extractedData;
  }

  // 数据验证
  async validate(parsedData: any, expect?: Object): Promise<boolean> {
    return true;
  }

  // 数据存储
  async persist(parsedData: any): Promise<boolean> {
    return true;
  }

  /**
   * @function 自动运行
   * @param isPersist
   * @returns {Promise.<Array.<Object>>}
   */
  async run(isPersist: boolean = true): Promise<Array<any>> {
    let rawData: any;

    this.status = 'FETCH';

    let checkPoint: number = Date.now();

    if (!this.url) {
      throw new Error('请设置有效的 URL');
    }

    // 执行数据抓取
    rawData = await this.fetch(this.url, this.option);

    // 由于数据提取是爬虫内部操作，因此此时的状态直接进入了解析
    this.status = 'PARSE';

    this.elapsedTime.fetch = Date.now() - checkPoint;

    checkPoint = Date.now();

    let beforeExtractedRawData = this.before_extract(rawData);

    // 避免用户意外 Hook before_extract
    if (!!rawData && !beforeExtractedRawData) {
      throw new Error('before_extract 应当设置有效返回值！');
    }

    // 从界面中抽取出选定元素
    let extracedDataOrObject: Object = await this.extract(
      beforeExtractedRawData,
      this.model
    );

    let parsedData: any;

    // 判断上一步的返回值是对象还是单个数据，这里是特意为 HTMLSpider 预留的功能，方便其返回文档的 DOM 对象到解析函数中
    if (
      typeof extracedDataOrObject === 'object' &&
      extracedDataOrObject.hasOwnProperty('data') &&
      extracedDataOrObject.hasOwnProperty('$')
    ) {
      parsedData = await this.parse(
        extracedDataOrObject.data,
        extracedDataOrObject.$
      );
    } else {
      // 对元素进行解析
      parsedData = await this.parse(extracedDataOrObject);
    }

    this.status = 'VALIDATE';

    this.elapsedTime.parse = Date.now() - checkPoint;

    checkPoint = Date.now();

    // 对解析结果进行验证
    await this.validate(parsedData, chaiExpect);

    this.status = 'PERSIST';

    this.elapsedTime.validate = Date.now() - checkPoint;

    checkPoint = Date.now();

    if (isPersist) {
      // 一组执行完毕后进行数据写入
      await this.persist(parsedData);
    }

    this.status = 'IDLE';

    this.elapsedTime.persist = Date.now() - checkPoint;

    return parsedData;
  }
}
