// @flow

import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Card, Progress } from "antd";
import Crawler from "../../entity/Crawler";
import "./CrawlerCard.scss";

/**
 * Description 爬虫卡片
 */
export default class CrawlerCard extends Component {
  static propTypes = {
    crawler: PropTypes.instanceOf(Crawler).isRequired,
    onToggleCrawler: PropTypes.func.isRequired
  };

  /**
   * Description 默认渲染函数
   * @returns {XML}
   */
  render() {
    const crawler: Crawler = this.props.crawler;

    return (
      <section className="CrawlerCard__container">
        <Card
          title={<span className="CrawlerCard__title">{crawler.name}</span>}
          extra={
            <span>
              <Link to={`/crawler/${crawler.name}`}>详情</Link> <a
                onClick={() => {
                  this.props.onToggleCrawler(crawler).then();
                }}
                href="#"
              >
                {crawler.isRunning ? "停止" : "运行"}
              </a>
            </span>
          }
          style={{ width: 300 }}
        >
          <p>名称：{crawler.displayName}</p>
          <p>是否正在运行：{crawler.isRunning ? "是" : "否"}</p>
          <p>
            最后激活时间：
            {crawler.isRunning ? crawler.lastStartTime : crawler.lastFinishTime}
          </p>
          <p>
            最后错误记录：
            {crawler.lastErrorMessage ? crawler.lastErrorMessage : "暂无"}
          </p>
          <p>
            请求数（待完成 / 已完成）：
            {`${crawler.leftSpiderTaskNum} / ${crawler.executedSpiderTaskNum}`}
          </p>
          <br />
          <div>
            <Progress
              percent={
                crawler.leftSpiderTaskNum === 0 &&
                  crawler.executedSpiderTaskNum === 0
                  ? 0
                  : (crawler.executedSpiderTaskNum /
                      (crawler.leftSpiderTaskNum +
                        crawler.executedSpiderTaskNum) *
                      100).toFixed(2)
              }
            />
          </div>
        </Card>
      </section>
    );
  }
}
