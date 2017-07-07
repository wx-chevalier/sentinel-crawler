// @flow

import React, { Component } from "react";
import PropTypes from "prop-types";
import "../status/OSInfo.scss";
import "./SpiderCountByTime.scss";
const echarts = require("echarts");

/**
 * @function 根据时间序列统计的爬虫次数
 */
export default class SpiderCountByTime extends Component {
  componentDidMount() {
    const spiders = this.props.spiders;

    let series = [];

    for (let spider of spiders) {
      let data = [];

      for (let key in spider.countByTime) {
        data.push([key, spider.countByTime[key]]);
      }

      series.push({
        name: spider.displayName,
        type: "line",
        showSymbol: true,
        smooth: true,
        data: data
      });
    }

    let option = {
      title: {
        text: "每分钟蜘蛛执行次数"
      },
      tooltip: {
        trigger: "axis",
        formatter: function(params) {
          return (
            params[0].seriesName +
            ":" +
            params[0].value[0] +
            "<br/>" +
            params[1].seriesName +
            ":" +
            params[1].value[1]
          );
        },
        axisPointer: {
          animation: false
        }
      },
      xAxis: {
        type: "value",
        splitLine: {
          show: false
        }
      },
      yAxis: {
        type: "value",
        splitLine: {
          show: false
        }
      },
      series: series
    };

    const chart = echarts.init(document.getElementById("echarts"));

    chart.setOption(option);
  }

  render() {
    return (
      <div className="SpiderCountByTime-container">
        <div id="echarts" />
      </div>
    );
  }
}
