// @flow

import React, { Component } from "react";
import PropTypes from "prop-types";
import "./OSInfo.css";
const echarts = require("echarts");

/**
 * @function 展示主机信息
 */
export default class OSInfo extends Component {
  static propTypes = {
    osInfo: PropTypes.object
  };

  componentDidMount() {
    const { cpu, memory } = this.props.osInfo;

    // 基于准备好的dom，初始化echarts实例
    const cpuChart = echarts.init(document.getElementById("cpu"));
    // 绘制图表
    cpuChart.setOption({
      tooltip: {
        formatter: "{a} <br/>{b} : {c}%"
      },
      series: [
        {
          name: "CPU",
          type: "gauge",
          detail: { formatter: "{value}%" },
          data: [{ value: (cpu * 100).toFixed(2), name: "CPU 占用率" }]
        }
      ]
    });

    // 基于准备好的dom，初始化echarts实例
    const memoryChart = echarts.init(document.getElementById("memory"));
    // 绘制图表
    memoryChart.setOption({
      tooltip: {
        formatter: "{a} <br/>{b} : {c}%"
      },
      series: [
        {
          name: "内存",
          type: "gauge",
          detail: { formatter: "{value}%" },
          data: [{ value: memory.toFixed(4) * 100, name: "内存占用率" }]
        }
      ]
    });
  }

  render() {
    return (
      <div className="OSInfo-container">
        <div id="cpu" />
        <div id="memory" />
      </div>
    );
  }
}
