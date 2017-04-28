# CrawlerServer 接口规范


## 接口说明

### 关键字段
- 爬虫
```
// 判断爬虫是否正在运行
isRunning: boolean = false;

// 爬虫最后一次激活时间
lastStartTime: Date;

// 爬虫最后一次运行结束时间
lastFinishTime: Date;

// 爬虫最后的异常信息
lastError: Error;
```
- 蜘蛛
```
// 最后一次运行时间
lastActiveTime: Date;

// 平均总执行时间 / ms
executeDuration: number = 0;

// 爬虫次数统计
count: number = 0;

// 异常次数统计
errorCount: number = 0;

countByTime: { [number]: number } = {};
```
### http://localhost:3001/ 获取当前爬虫运行状态
- 尚未启动
```
[
    {
        name: "UACrawler",
        displayName: "通用公告爬虫",
        isRunning: false,
    }
]
```
- 正常返回
```
[
    {
        name: "UACrawler",
        displayName: "通用公告爬虫",
        isRunning: true,
        lastStartTime: "2017-04-19T06:41:55.407Z"
    }
]
```
- 出现错误
```
[
    {
        name: "UACrawler",
        displayName: "通用公告爬虫",
        isRunning: true,
        lastStartTime: "2017-04-19T06:46:05.410Z",
        lastError: {
            spiderName: "UAListSpider",
            message: "抓取超时",
            url: "http://ggzy.njzwfw.gov.cn/njggzy/jsgc/001001/001001001/001001001001?Paging=1",
            time: "2017-04-19T06:47:05.414Z"
        }
    }
]

```

### http://localhost:3001/start 启动爬虫
```
{
    message:"OK"
}
```
### http://localhost:3001/status 返回当前系统状态
```
{
    "cpu":0,
    "memory":0.9945211410522461
}
```

### http://localhost:3001/UACrawler 根据爬虫名查看爬虫运行状态
```
[  
   {  
      "name":"UAListSpider",
      "displayName":"通用公告列表蜘蛛",
      "count":6,
      "countByTime":{  
         "0":0,
         "1":0,
         "2":0,
         "3":0,
         ...
         "58":0,
         "59":0
      },
      "lastActiveTime":"2017-04-19T06:50:06.935Z",
      "executeDuration":1207.4375,
      "errorCount":0
   },
   {  
      "name":"UAContentSpider",
      "displayName":"通用公告内容蜘蛛",
      "count":120,
      "countByTime":{  
         "0":0,
         ...
         "59":0
      },
      "lastActiveTime":"2017-04-19T06:51:11.072Z",
      "executeDuration":1000.1596102359835,
      "errorCount":0
   }
]
```
