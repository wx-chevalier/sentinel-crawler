//自动进行全局的ES6 Promise的Polyfill
require('es6-promise').polyfill();
const urlencode = require('isomorphic-urlencode');

//如果是在浏览器环境下则直接载入fetch对象

/**
 * @author 王下邀月熊
 * @function Fluent, Super Agent Style Wrapper For Fetch
 * @features Fluent API、Cache Strategy、Timeout Strategy、Retry Strategy
 */
export default class FluentFetcher {


  /**
   * @function 默认构造函数
   * @param scheme http 或者 https
   * @param host 请求的域名
   * @param encoding 编码方式,常用的为 utf8 或者 gbk
   * @param accept 返回的数据类型 常用的为 text 或者 json
   */
  constructor({scheme = "http", host = "api.com", encoding = "utf8", acceptType = "json"} = {}) {

    /**
     * @region 请求相关控制
     */
    this.scheme = scheme;

    this.host = host;

    //注意,对于非utf8编码,请输入编码之后的字符串
    this.encoding = encoding;

    //预期接收的数据类型
    this.acceptType = acceptType;


    /**
     * @region 其他初始化值
     */
    //请求路径
    this.path = '';

    //请求参数
    this.params = {};

    //设置请求内容类型 json / x-www-form-urlencoded
    this.contentType = "json";

    //请求的选项设置
    this.option = {
      //默认设置为非CORS请求
    };

    /**
     * @region 辅助参数
     */
    this.mockData = {};


  }

  /**
   * @region 公用方法定义区域
   */

  /**
   * @region 基本请求方法定义
   */

  /**
   * @function 设定本次请求的所有的请求参数,务必在选定方法之前调用
   * @description 先强制设定好全部的请求参数,这样分别在get、post、put、delete中就可以进行参数封装了
   * @param params
   */
  parameter(params) {

    //判断是否已经封装过了请求方法
    if (!params) {
      throw new Error("请设置有效请求参数");
    }

    this.params = params;

    return this;

  }


  //这里输入的path是不会进行编码的,因此不要输入一些动态参数
  get(path = "/") {

    //封装请求类型
    this._method('get', path);

    //重置body，避免之前使用过post
    this.option.body = null;

    return this;
  }

  /**
   * @function 以POST形式发起请求
   * @param path
   * @param contentType
   * @return {FluentModel}
   */
  post(path = "/", contentType = "json") {

    this._method('post', path, contentType);

    return this;
  }

  /**
   * @function 以put形式发起请求
   * @param path
   * @param contentType
   * @return {FluentFetcher}
   */
  put(path = "/", contentType = "json") {

    this._method('put', path, contentType);

    return this;

  }

  /**
   * @function 以delete方法发起请求
   * @param path
   * @param contentType
   * @return {FluentFetcher}
   */
  delete(path = "/", contentType = "json") {

    this._method('delete', path, contentType);

    return this;
  }

  /**
   * @function 请求头设置
   * @key 请求键名
   * @value 请求值名
   */
  header(key = "Accept", value = "application/json") {

    if (!this.option.headers) {
      this.option.headers = {};
    }

    this.option.headers[key] = value;

    //为了方便链式调用
    return this;
  }

  /**
   * @function 请求路径封装，自动进行编码操作
   * @param segment
   * @return {FluentModel}
   */
  pathSegment({segment = ""}) {

    if (!!segment) {

      //当segment有意义值时
      this.path = `${this.path}/${this._encode(segment)}`;

    }

    //返回当前对象
    return this;

  }

  /**
   * @function 设置本次请求为CORS
   */
  cors() {

    this.option.mode = "cors";

    this.header('Origin', '*');

    return this;
  }

  mock(data = {}): FluentFetcher {


    this.mockData = data;

    return this;

  }

  /**
   * @region 请求体构造与请求策略构造
   */

  cookie() {

    return this;

  }

  timeout({time = 0}) {

  }

  /**
   * @function 仅允许对于GET动作进行缓存
   * @return {FluentModel}
   */
  cache({
    cacheControl = "no-cache",
    maxAge = "0"
  }) {

    return this;

  }

  /**
   * @function 失败重试策略
   * @return {FluentModel}
   */
  retry() {

    return this;

  }

  /**
   * @function 进行最后的构建工作,一旦调用该函数即不可以再修改之前的配置
   * @return {Promise}
   */
  build() {

    //构造请求路径
    let packagedPath = `${this.scheme}://${this.host}${this.path}`;

    //封装请求参数字符串，
    let queryString = this._parseParamsToQueryStringOrSetBody();

    //封装好的请求地址
    let url;

    //在查询字符串有意义的情况下，将其封装到path尾部
    if (!!queryString) {
      url = `${packagedPath}?${queryString}`
    } else {
      url = packagedPath;
    }

    //判断是否存在有Mock数据
    if (this._isMock()) {
      return this._buildMock();
    }

    //判断是否为微信环境
    if (this._isWeapp()) {
      return this._buildWeapp(url);
    }

    require('isomorphic-fetch');

    //构建fetch请求
    return fetch(url, this.option)
      .then(this._checkStatus, (error) => {
        throw error;
      })
      .then(this.acceptType === "json" ? this._parseJSON : this._parseText, (error) => {
        throw error;
      });

  }


  /**
   * @function 判断是否为Weapp
   * @private
   */
  _isWeapp(): bool {

    if (typeof wx !== 'undefined') {
      return true;
    } else {
      return false;
    }

  }

  /**
   * @function 如果是Weapp环境下则构建Weapp内建的请求
   * @param url
   * @return {Promise}
   * @private
   */
  _buildWeapp(url): Promise {

    return new Promise((resolve, reject) => {
      wx.request({
        url,
        method: this.option.method,
        data: this.params,
        header: this.option.headers,
        success: function (res) {
          resolve(res.data)
        },
        fail: function (err) {
          reject(err)
        }
      })
    });

  }

  /**
   * @function 根据当前路径判断是否需要Mock
   * @param path
   * @private
   */
  _isMock(): bool {

    if (!!this.mockData[this.path]) {
      return true;
    } else {
      return false;
    }

  }

  /**
   * @function 如果是Mock数据则直接返回数据
   * @private
   */
  _buildMock(): Promise {

    //构造Promise对象
    return new Promise((resolve, reject) => {

      resolve(this.mockData[this.path]);

    });

  }


  /**
   * @function 封装请求类型
   * @param method
   * @param path
   * @param contentType
   * @private
   */
  _method(method = 'get', path = '/', contentType = 'json') {


    //设置请求方式
    this.option.method = method;

    //设置请求数据类型
    this.contentType = contentType;

    //根据不同的ContentType构建不同的请求头
    this.header('Content-Type', `application/${contentType}`);

    //设置请求路径
    this.path = `${path}`;

  }

  /**
   * @region 私有方法定义区域
   * @function 将传入的参数解析为请求字符串
   * @param method 请求方法
   * @param contentType 请求类型
   */

  _parseParamsToQueryStringOrSetBody() {

    //查询字符串
    let queryString = '';

    //判断当前是否已经设置了请求方法
    if (!this.option.method) {
      throw new Error("请设置请求方法");
    }

    //将请求参数封装到查询参数中
    for (let key in this.params) {
      queryString += `${key}=${this._encode(this.params[key])}&`
    }

    //删除最后一个无效的`&`,以避免被误认为SQL Injection
    queryString = queryString.substr(0, queryString.length - 1);


    //判断是否为GET
    if (this.option.method === "get") {

      //如果是GET,则将请求数据添加到URL中,这一步在build函数中进行了
      return queryString;

    } else if (this.contentType === "x-www-form-urlencoded") {

      //根据不同的编码格式设置不同的body内容
      //将构造好的查询字符串添加到body中
      this.option.body = queryString;

    } else {

      //如果是以JSON形式发起请求，则直接构造JSON字符串
      this.option.body = JSON.stringify(this.params);

    }

    return null;

  }

  

  /**
   * @function 对于本次请求进行签名,主要是封装好的请求的URL
   * @private
   */
  _signature() {

  }

  /**
   * @function 利用设置好的编码格式进行编码
   * @param str
   * @private
   */
  _encode(str) {

    if (this.encoding === "utf8") {
      return encodeURIComponent(str);
    } else {
      return urlencode(str, this.encoding);
    }

  }
}