/**
 * @function 监控界面
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import "antd/dist/antd.less";
import { BrowserRouter, Route } from "react-router-dom";

import Home from "../home/Home";
import Statistic from "../statistic/Statistic";
import { Provider } from "mobx-react";
import getStores from "../store/stores";
import CrawlerCard from "../component/CrawlerCard";
import OSInfo from "../component/OSInfo";
import SpiderCountByTime from "../component/SpiderCountByTime";
import data from "../api/mock";
import "./DeclarativeCrawlerUI.css";

/**
 * Description
 */
export default class DeclarativeCrawlerUI extends Component {
  static propTypes = {
    crawlerServer: PropTypes.string.isRequired,
    // 是否隐藏导航栏，用于嵌入到其他界面中
    hiddenNavigator: PropTypes.bool
  };

  static defaultProps = {
    crawlerServer: "localhost:3001",
    hiddenNavigator: false
  };

  state = {
    // 0 - 正在加载 1 - 数据加载完毕 2 - 数据加载失败，显示错误界面
    loading: 0
  };

  render() {
    const dataObject = JSON.parse(data);

    return (
      <Provider {...getStores(this.props.crawlerServer)}>
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
              <Route exact path="/" component={Home} />
              <Route path="/home" component={Home} />
              <Route path="/statistic" component={Statistic} />
            </div>
          </BrowserRouter>
        </div>
      </Provider>
    );
  }
}
