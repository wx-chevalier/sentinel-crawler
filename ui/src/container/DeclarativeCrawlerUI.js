// @flow

import React, { Component } from "react";
import PropTypes from "prop-types";
import "antd/dist/antd.less";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from "mobx-react";

import Home from "./home/Home";
import getStores from "../store/stores";
import "./DeclarativeCrawlerUI.scss";
import CrawlerStatistic from "./statistic/CrawlerStatistic";

/**
 * Description 主界面入口
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

  render() {
    return (
      <Provider {...getStores(this.props.crawlerServer)}>
        <div className="App-container">
          <Router>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route
                exact
                path="/crawler/:crawlerName"
                component={CrawlerStatistic}
              />
            </Switch>
          </Router>
        </div>
      </Provider>
    );
  }
}
