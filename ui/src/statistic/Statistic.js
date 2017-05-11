import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import PieComponent from '../component/PieComponent'
import ColumnarComponent from '../component/ColumnarComponent'
import PolylineComponent from '../component/PolylineComponent'
import './Statistic.css'

@inject('statisticStore')
@observer
export default class Statistic extends Component{
  render(){
    const statistic = this.props.statisticStore

    return (
      <div className="Main">
        <h1>爬虫统计</h1>
        <div className="Above">
          <h3>爬虫运行实时统计</h3>
          <PolylineComponent data={statistic.timeLine} size={{width: "100%", height: "400px"}}/>
        </div>
        <div className="Below">
          <div className="Statistic-PI">
            <h3>系统性能及爬虫占比</h3>
            <ul>
              <li><PieComponent data={statistic.systemPie.slice()} size={{width: "200px", height: "200px"}}/></li>
              <li><PieComponent data={statistic.spiderPie.slice()} size={{width: "200px", height: "200px"}}/></li>
            </ul>
          </div>
          <div className="Statistic-Table">
            <h3>爬虫统计</h3>
            <ColumnarComponent data={statistic.spiderColumnar} size={{width: "500px", height: "350px"}}/>
          </div>
        </div>
      </div>
    )
  };
}