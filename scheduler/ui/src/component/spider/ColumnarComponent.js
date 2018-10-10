import React, {Component} from 'react';

let echarts = require('echarts');

class ColumnarComponent extends Component{
  constructor(props){
    super(props);
    this.setComponentOption = this.setComponentOption.bind(this);
    this.initComponent = this.initComponent.bind(this);
  }

  setComponentOption(data){
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01]
      },
      yAxis: {
        type: 'category',
        data: data.name.slice()
      },
      series: [
        {
          name: '爬虫运行时间',
          type: 'bar',
          data: data.result.slice()
        }
      ]
    }
  }

  initComponent(){
    let columnarChart = echarts.init(this.refs.main);
    let options = this.setComponentOption(this.props.data);
    columnarChart.setOption(options);
  }

  componentDidMount(){
    this.initComponent()
  }

  componentDidUpdate(){
    this.initComponent();
  }

  render(){
    return (
      <div ref="main" style={{width: this.props.size.width, height: this.props.size.height}}>

      </div>
    )
  }
}

export default ColumnarComponent;