/**
 * @function 监控界面
 */
import React, { Component } from "react";
import data from "./api/mock";
import "./App.css";
import "antd/dist/antd.css";
import {BrowserRouter, Route} from 'react-router-dom'
import Home from './home/Home'
import Statistic from './statistic/Statistic'

import CrawlerCard from "./component/CrawlerCard";
import OSInfo from "./component/OSInfo";
import SpiderCountByTime from "./component/SpiderCountByTime";

class App extends Component {
  render() {
    const dataObject = JSON.parse(data);

    return (
      <div className="App-container">
        <div className="App-crawlers">
          <CrawlerCard crawler={dataObject.crawlers[0]} />
        </div>
        <div className="App-OSInfo">
          <OSInfo osInfo={dataObject.status} />
        </div>
        <div className="App-SpiderCountByTime">
          <SpiderCountByTime spiders={dataObject.spiders} />
        </div>
        <BrowserRouter>
          <div>
            <Route exact path='/' component={Home}/>
            <Route path='/home' component={Home}/>
            <Route path='/statistic' component={Statistic}/>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
