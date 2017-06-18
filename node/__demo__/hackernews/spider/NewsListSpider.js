// @flow

import HTMLSpider from "../../../src/spider/web/HTMLSpider";

/**
 * Description 抓取 Hacker News 新闻列表
 *
 */
/*
<tr class="athing" id="14538351">
  <td align="right" valign="top" class="title">
    <span class="rank">16.</span>
  </td>
  {" "}
  <td valign="top" class="votelinks">
    <center>
      <a
        id="up_14538351"
        onclick="return vote(event, this, &quot;up&quot;)"
        href="vote?id=14538351&amp;how=up&amp;auth=a7acbef546ee3e0885b91fbc46c92f18570c44b2&amp;goto=news"
        muse_scanned="true"
      >
        <div class="votearrow" title="upvote" />
      </a>
    </center>
  </td>
  <td class="title">
    <a href="https://keygen.sh" class="storylink" muse_scanned="true">
      Show HN: Keygen – A dead-simple software licensing API built for developers
    </a>
    <span class="sitebit comhead">
      {" "}
      (
      <a href="from?site=keygen.sh" muse_scanned="true">
        <span class="sitestr">keygen.sh</span>
      </a>
      )
    </span>
  </td>
</tr>
<tr>
  <td colspan="2" /><td class="subtext pocket-inserted">
  <span class="score" id="score_14537650">95 points</span>
  {" "}
  by
  {" "}
  <a href="user?id=CarolineW" class="hnuser" muse_scanned="true">CarolineW</a>
  {" "}
  <span class="age">
      <a href="item?id=14537650" muse_scanned="true">14 hours ago</a>
    </span>
  {" "}
  <span id="unv_14537650" />
  {" "}
  |
  {" "}
  <a
    href="hide?id=14537650&amp;goto=news&amp;auth=1a8c39d04af18f5dc7c56671db2fbd759fca0efb"
    onclick="return hidestory(event, this, 14537650)"
    muse_scanned="true"
  >
    hide
  </a>
  {" "}
  |
  {" "}
  <a href="item?id=14537650" muse_scanned="true">47&nbsp;comments</a>
  {" "}
  |
  {" "}
  <a class="pocket-hn-button" href="#" muse_scanned="true">save to pocket</a>
</td>
</tr>;
 */

export default class NewsListSpider extends HTMLSpider {
  // 定义模型
  model = {
    "tr.athing": {
      // 标题
      $title: ".title > a",

      // 来源网址
      $site: ".sitebit > a",

      // 得分
      $self: "self"
    }
  };

  /**
   * @function 默认解析函数
   * @param pageObject
   * @param $
   * @returns {Array}
   */
  parse(pageObject: any, $: Element) {
    // 存放全部的抓取到的对象
    let stories = [];

    for (let { $title, $site, $self } of pageObject["tr.athing"]) {
      stories.push({
        id: $self.attr("id"),
        title: $title.text(),
        href: $title.attr("href"),
        site: $site.text(),
        score: $self.next().find(".score").text().split(" ")[0]
      });
    }

    return stories;
  }
}
