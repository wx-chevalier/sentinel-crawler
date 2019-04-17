// @flow

import React, { PureComponent } from "react";
import { Spin } from "antd";

/**
 * Description 通用加载提示符
 */
export default class Loading extends PureComponent {
  render() {
    return (
      <section>
        <Spin tip="等待配置服务器地址或者抓取数据！" />
      </section>
    );
  }
}
