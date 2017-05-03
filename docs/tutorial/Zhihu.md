
> [使用 declarative-crawler 爬取知乎美图]() 是笔者对 [declarative-crawler](https://github.com/wxyyxc1992/declarative-crawler) 的具体实例讲解，从属于笔者的 [程序猿的数据科学与机器学习实战手册](https://parg.co/b4C)。

# 处理动态页面的蜘蛛设计

目前知乎是基于 React 构建的动态网络，换言之

```
https://pic4.zhimg.com/a99b7a9933526403f0b012bd9c11dbbf_60w.jpg
https://pic1.zhimg.com/151ee0138f8432d61977504615d0614c_60w.jpg
https://pic2.zhimg.com/c2847b95e204cd6e23fca03d18610a65_60w.jpg
https://pic2.zhimg.com/5f026494c8bcc7283770e84c37c1aa49_60w.jpg
https://pic1.zhimg.com/4bd564be18599d169a6fab3b83f3c418_60w.jpg
https://pic1.zhimg.com/16eb0d6650f962d8ff1b0b339a4563cc_60w.jpg
https://pic1.zhimg.com/b6f5310d9fac7c173ce8e310f6196f38_60w.jpg
https://pic3.zhimg.com/0aac046c829d37edcf0b9ba780dc2f92_60w.jpg
https://pic3.zhimg.com/c4cdff37d72774768c202478c1adc1b6_60w.jpg
https://pic1.zhimg.com/aa1dc6506f009530c701ae9ae283c424_60w.jpg
https://pic4.zhimg.com/200c20e15a427b5a740bc7577c931133_60w.jpg
https://pic4.zhimg.com/7be083ae4531db70b9bd9149dc30dd1b_60w.jpg
https://pic2.zhimg.com/5261bc283c6c2ed2900a504e2677d365_60w.jpg
https://pic1.zhimg.com/9a6762c751175966686bf93bf009ab30_60w.jpg
https://pic4.zhimg.com/b1b92239d6718aa146b0669dc423e693_60w.jpg
```
```
await Input.synthesizeScrollGesture({
    x: 0,
    y: 0,
    yDistance: -10000,
    repeatCount: 10
});
```

# 声明处理单页面的蜘蛛

## 主题列表页

## 答案页图片提取

# 声明串联多个蜘蛛的爬虫

# 服务端运行与监控

```
http://localhost:3001/

[
    {
        name: "BeautyTopicCrawler",
        displayName: "Crawler",
        isRunning: true,
        lastStartTime: "2017-05-03T05:03:58.217Z"
    }
]
```

```
http://localhost:3001/start
```

```
http://localhost:3001/BeautyTopicCrawler

{

    "leftRequest": 37,
    "spiders": [
        {
            "name": "TopicSpider",
            "displayName": "Spider",
            "count": 2,
            "countByTime": {
                "0": 0,
                "59": 0
            },
            "lastActiveTime": "2017-05-03T04:56:31.650Z",
            "executeDuration": 13147.5,
            "errorCount": 0
        },
        {
            "name": "AnswerAndPersistImageSpider",
            "displayName": "Spider",
            "count": 1,
            "countByTime": {
                "0": 0,
                "59": 0
            },
            "lastActiveTime": "2017-05-03T04:56:44.513Z",
            "executeDuration": 159120,
            "errorCount": 0
        }
    ]

}
```

我们也可以通过预定义的监控界面来实时查看爬虫运行状况（正在重制中，尚未接入真实数据），可以到根目录的 ui 文件夹中运行：
```
yarn install 
npm start
```
即可以看到如下界面：

![](https://coding.net/u/hoteam/p/Cache/git/raw/master/2017/3/2/WX20170419-211515.png)