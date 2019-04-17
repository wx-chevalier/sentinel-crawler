/**
 * Description 主界面
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { observer, inject } from "mobx-react";
import { message, Icon, Input, Button } from "antd";
const Search = Input.Search;

import "./Home.scss";
import CrawlerStore from "../../store/CrawlerStore";
import Loading from "../../component/ux/Loading";
import Crawler from "../../entity/Crawler";
import CrawlerCard from "../../component/crawler/CrawlerCard";
import OSInfo from "../../component/status/OSInfo";
import ReloadButton from "../../component/ux/ReloadButton";
@inject("crawlerStore")
@observer
export default class Home extends Component {
  static propTypes = {
    crawlerStore: PropTypes.instanceOf(CrawlerStore)
  };

  state = {
    searchValue: undefined
  };

  host = "localhost:3001";

  /**
   * Description 设置新的服务器地址
   * @returns {Promise.<void>}
   * @private
   */
  _setHost = async () => {
    const crawlerStore: CrawlerStore = this.props.crawlerStore;

    if (!this.host) {
      message.error("请输入正确的服务器地址！");
    } else {
      try {
        await crawlerStore.setHost(this.host);
        message.success("设置服务器地址成功！");
      } catch (e) {
        message.error("无法从指定服务器抓取数据，请确认设置了正确的地址！");
      }
    }
  };

  /**
   * Description 渲染内容
   * @returns {XML}
   * @private
   */
  _renderContent() {
    const crawlerStore: CrawlerStore = this.props.crawlerStore;
    // 数据正在加载则返回加载中
    if (!crawlerStore.crawlers) {
      return <div className="content"><Loading /></div>;
    }
    return (
      <div className="content">
        <div className="crawlers">
          {crawlerStore.crawlers
            .filter((crawler: Crawler, index) => {
              if (!this.state.searchValue) {
                return true;
              } else {
                return (
                  crawler.name.includes(this.state.searchValue) ||
                  crawler.displayName.includes(this.state.searchValue)
                );
              }
            })
            .map((crawler: Crawler, index) => (
              <div className="crawler">
                <CrawlerCard
                  crawler={crawler}
                  onToggleCrawler={async (crawler: Crawler) => {
                    await crawlerStore.startCrawler(crawler.name);
                  }}
                  key={index}
                />
              </div>
            ))}
        </div>
        <div className="osInfo">
          <OSInfo osInfo={crawlerStore.osInfo} />
        </div>
      </div>
    );
  }

  render() {
    const crawlerStore: CrawlerStore = this.props.crawlerStore;

    return (
      <div className="Home__container">
        <div className="appbar">
          <div className="host">
            <Input
              addonAfter={<Icon onClick={this._setHost} type="setting" />}
              onChange={(e, value) => {
                this.host = e.target.value;
              }}
              onPressEnter={this._setHost}
              placeholder="请设置爬虫服务器"
            />
          </div>
          <div className="search">
            <Search
              placeholder="根据爬虫名/展示名过滤"
              style={{
                height: "40px"
              }}
              onSearch={value => {
                this.setState({
                  searchValue: value
                });
              }}
            />
          </div>
          <div className="button">
            <Button
              type="primary"
              style={{
                height: "40px"
              }}
              onClick={async () => {
                try {
                  await crawlerStore.startCrawler("all");
                } catch (e) {
                  message.error("启动失败，请查看服务器或命令行日志！");
                }
              }}
            >
              启动全部爬虫
            </Button>
          </div>
        </div>
        {this._renderContent()}
        <ReloadButton
          onClick={async () => {
            await crawlerStore.loadHomeInfo();
          }}
        />
      </div>
    );
  }
}
