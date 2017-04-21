// @flow

import React, { Component } from "react";
import PropTypes from "prop-types";
import { Card } from "antd";

export default class CrawlerCard extends Component {
  static propTypes = {
    crawler: PropTypes.object
  };

  render() {
    const { name, displayName, isRunning, lastStartTime } = this.props.crawler;

    return (
      <section className="CrawlerCard-container">
        <Card
          title={name}
          extra={<span><a href="#">详情</a> <a href="#">运行</a></span>}
          style={{ width: 300 }}
        >
          <p>名称：{displayName}</p>
          <p>是否正在运行：{isRunning ? "是" : "否"}</p>
          <p>最后启动时间：{lastStartTime}</p>
        </Card>
      </section>
    );
  }
}
