// @flow
const urlencode = require("isomorphic-urlencode");

/**
 * @region 类型定义
 */
export type RequestType = {
  // 请求地址
  url: string,

  // fetch 使用的配置
  option: { [string]: any }
};

/**
 * @endregion 类型定义
 */

export default class RequestBuilder {
  // 当前协议名
  scheme: string = "http";

  // 当前主机
  host: string = "api.com";

  // 当前编码
  encoding: string = "utf8";

  // 请求路径
  path: string = "/";

  // cookie 参数
  cookieParams: { [string]: any } = {};

  // 最后封装而成的 option
  _option: { [string]: any } = {};

  /**
     * @function 默认构造函数
     * @param scheme http 或者 https
     * @param host 请求的域名
     * @param encoding 编码方式,常用的为 utf8 或者 gbk
     */
  constructor({ scheme, host, encoding }: any = {}) {
    this.scheme = scheme || this.scheme;

    this.host = host || this.host;

    this.encoding = encoding || this.encoding;
  }

  /**
     * @function 请求头设置
     * @key 请求键名或者存放键值的对象
     * @value 请求值名
     */
  header(key: string | Object = "Accept", value: string = "application/json") {
    // 判断当前是否存在头配置
    if (!this._option.headers) {
      this._option.headers = {};
    }

    if (typeof key === "string") {
      this._option.headers[key] = value;
    } else {
      this._option.headers = Object.assign({}, this._option.headers, key);
    }

    //为了方便链式调用
    return this;
  }

  //这里输入的path是不会进行编码的,因此不要输入一些动态参数
  get(path: string = "/") {
    //封装请求类型
    this._method("get", path);

    //重置body，避免之前使用过post
    this._option.body = null;

    return this;
  }

  /**
     * @function 以POST形式发起请求
     * @param path
     * @param params
     * @param contentType json / x-www-form-urlencoded
     * @return {RequestBuilder}
     */
  post(
    path: string = "/",
    params: Object = {},
    contentType: string = "json"
  ): RequestBuilder {
    //判断是否已经封装过了请求方法
    if (!params) {
      throw new Error("请设置有效请求参数");
    }

    this._method("post", path, params, contentType);

    return this;
  }

  /**
     * @function 以PUT形式发起请求
     * @param path
     * @param params
     * @param contentType
     * @return {RequestBuilder}
     */
  put(
    path: string = "/",
    params: Object = {},
    contentType: string = "json"
  ): RequestBuilder {
    //判断是否已经封装过了请求方法
    if (!params) {
      throw new Error("请设置有效请求参数");
    }

    this._method("put", path, params, contentType);

    return this;
  }

  /**
     * @function 请求路径封装，自动进行编码操作
     * @param segment
     * @return {RequestBuilder}
     */
  pathSegment(segment: string = ""): RequestBuilder {
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
  cors(origin: string = "*"): RequestBuilder {
    this._option.mode = "cors";

    this.header("Origin", origin);

    return this;
  }

  /**
     * function
     * @param {*} keyOrMap * 表示自动带上所有的 cookie
     * @param {*} value 当第一个参数为字符串时，使用第二个参数的键值
     */
  cookie(keyOrMap: string | Object, value: string = "value"): RequestBuilder {
    if (!keyOrMap) {
      return this;
    }

    if (typeof keyOrMap === "string") {
      if (keyOrMap === "*") {
        this._option.credentials = "include";
      } else {
        this.cookieParams[keyOrMap] = value;
      }
    } else {
      this.cookieParams = Object.assign({}, this.cookieParams, keyOrMap);
    }

    return this;
  }

  /**
     * @function 仅允许对于GET动作进行缓存
     * @return {RequestBuilder}
     */
  cache(cacheControl: string = "no-cache", maxAge: number = 0): RequestBuilder {
    return this;
  }

  /**
     * @function 进行最后的构建工作,一旦调用该函数即不可以再修改之前的配置
     * @return {Promise}
     */
  build(queryParams?: Object) {
    // 构造请求路径
    let packagedPath = `${this.scheme}://${this.host}${this.path}`;

    // 设置 Cookie
    if (!!this.cookieParams && Object.keys(this.cookieParams).length > 0) {
      this.header("Cookie", this._paramsToQueryString(this.cookieParams));
    }

    let queryString = !!this._paramsToQueryString(queryParams)
      ? `?${this._paramsToQueryString(queryParams)}`
      : "";

    return {
      url: packagedPath + queryString,
      option: this._option
    };
  }

  /**
     * @function 封装请求类型
     * @param method
     * @param path
     * @param params
     * @param contentType 设置请求内容类型 json / x-www-form-urlencoded
     * @private
     */
  _method(
    method: string = "get",
    path: string = "/",
    params: Object = {},
    contentType: string = "json"
  ) {
    //设置请求方式
    this._option.method = method;

    //根据不同的ContentType构建不同的请求头
    this.header("Content-Type", `application/${contentType}`);

    // 设置不同的请求体格式
    if (method !== "get") {
      if (contentType === "x-www-form-urlencoded") {
        //根据不同的编码格式设置不同的body内容
        //将构造好的查询字符串添加到body中
        this._option.body = this._paramsToQueryString(params);
      } else {
        //如果是以JSON形式发起请求，则直接构造JSON字符串
        this._option.body = JSON.stringify(params);
      }
    }

    //设置请求路径
    this.path = `${path}`;
  }

  /**
     * @function 利用设置好的编码格式进行编码
     * @param str
     * @private
     */
  _encode(str: string) {
    if (this.encoding === "utf8") {
      return encodeURIComponent(str);
    } else {
      return urlencode(str, this.encoding);
    }
  }

  /**
     * @function 将对象解析为字符串
     * @param {*} params
     */
  _paramsToQueryString(params: Object | void): string {
    let queryString: string = "";

    // 构造查询字符串
    if (!!params && Object.keys(params).length > 0) {
      for (let key in params) {
        if (params.hasOwnProperty(key)) {
          queryString += `${key}=${this._encode(params[key])}&`;
        }
      }

      //删除最后一个无效的`&`,以避免被误认为SQL Injection
      queryString = queryString.substr(0, queryString.length - 1);
    }

    return queryString;
  }
}
