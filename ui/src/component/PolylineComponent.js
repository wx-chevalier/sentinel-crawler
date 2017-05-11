import React, {Component} from 'react';

let echarts = require('echarts');

class PolylineComponent extends Component{
  constructor(props){
    super(props);
    this.setComponentOption = this.setComponentOption.bind(this);
    this.initComponent = this.initComponent.bind(this);
  }

  setComponentOption(){
    const data = this.props.data;

    return {
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: data.name.slice()
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value}'
        },
        axisPointer: {
          snap: true
        }
      },
      series: [
        {
          name:'执行次数',
          type:'line',
          smooth: true,
          data: data.result.slice()
        }
      ]
    }
  }

  initComponent(){
    echarts.init(this.refs.main).setOption(this.setComponentOption());
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

export default PolylineComponent;