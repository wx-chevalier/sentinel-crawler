import React, { Component } from "react";

let echarts = require("echarts");

class PieComponent extends Component {
  constructor(props) {
    super(props);
    this.setComponentOption = this.setComponentOption.bind(this);
    this.init = this.init.bind(this);
  }

  setComponentOption(data) {
    return {
      series: [
        {
          name: "比例",
          type: "pie",
          radius: ["70%", "90%"],
          avoidLabelOverlap: true,
          data: data, //传入外部的data数据
          label: {
            normal: {
              show: false,
              position: "center",
              textStyle: {
                fontSize: "18"
              },
              formatter: "{d}% \n{b}"
            },
            emphasis: {
              show: true,
              textStyle: {
                fontSize: "18"
              }
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          }
        }
      ]
    };
  }

  init() {
    const { data } = this.props; //外部传入的data数据
    let pieChart = echarts.init(this.refs.main); //初始化echarts

    //我们要定义一个setPieOption函数将data传入option里面
    let options = this.setComponentOption(data);
    //设置options
    pieChart.setOption(options);
  }

  componentDidMount() {
    this.init();
  }

  componentDidUpdate() {
    this.init();
  }

  render() {
    return (
      <div
        ref="main"
        style={{ width: this.props.size.width, height: this.props.size.height }}
      />
    );
  }
}

export default PieComponent;
