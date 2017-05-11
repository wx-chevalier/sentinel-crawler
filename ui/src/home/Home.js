import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {observer, inject} from 'mobx-react'
import './Home.css'

@inject('homeStore')
@observer
export default class Home extends Component{
  render(){
    const listStore = this.props.homeStore
    const TaskList = listStore.taskLists
    return (
      <div className="App">
        <h1>爬虫统计监测</h1>
        <div className="Up">
          <h3>爬虫列表</h3>
          <ul className="Task-Table">
            {TaskList.map((task, index) => <TaskShow DetailTask={task} key={index}/>)}
          </ul>
        </div>
        <div className="Down">
          <h3>错误信息</h3>
          <div className="ErrorMessage">
            错误信息列表
          </div>
        </div>
      </div>
    );
  }
}

class TaskShow extends Component{
  constructor(props){
    super(props);

    this.StartSpider = this.StartSpider.bind(this);
  }

  StartSpider(){
    if(this.props.DetailTask.isRunning){
      console.log('Running......')
    }else{
      console.log('Start Running......')
    }
  }

  render(){
    return (
      <li>
        <ul className="Inside-Task-Table">
          <li><span>名称：</span><span>{this.props.DetailTask.name}</span></li>
          <li><span>展示名称：</span><span>{this.props.DetailTask.displayName}</span></li>
          <li><span>运行状态：</span><span>{this.props.DetailTask.isRunning ? '运行中' : '未运行'}</span></li>
          <li><span>是否运行：</span><span><button onClick={this.StartSpider}>{this.props.DetailTask.isRunning ? '开始执行' : '执行完毕'}</button></span></li>
          <li><span>查看详情：</span><span><Link to='statistic'>查看</Link></span></li>
        </ul>
      </li>
    );
  }
}