import { observable, action } from "mobx";

export default class StatisticStore {
  @observable spiderPie = [];
  @observable spiderColumnar = { name: [], result: [] };
  @observable timeLine = { name: [], result: [] };
  @observable systemPie = [];

  @action requestStatistic() {
    fetch("/data/spiders_result.json")
      .then(function(response) {
        return response.json();
      })
      .then(spiders => {
        const result = this.calculateSpider(spiders);
        this.spiderPie = result.spider;
        this.spiderColumnar = result.columnar;
        this.timeLine = result.line;
      })
      .catch(error => {
        console.log(error);
      });

    fetch("/data/system.json")
      .then(function(response) {
        return response.json();
      })
      .then(system => {
        this.systemPie = this.calculateSystem(system);
      })
      .catch(error => {
        console.log(error);
      });
  }

  calculateSpider(spiders) {
    let spiderPie = [];
    let spiderColumnar = { name: [], result: [] };
    let timeLine = { name: [], result: [] };
    spiders.forEach(function(spider) {
      spiderPie.push({ value: spider.count, name: spider.displayName });
      spiderColumnar.name.push(spider.displayName);
      spiderColumnar.result.push(spider.executeDuration.toFixed(2));

      for (let time in spider.countByTime) {
        if (timeLine.name[time] === undefined) {
          timeLine.name[time] = time;
        }

        if (timeLine.result[time] === undefined) {
          timeLine.result[time] = spider.countByTime[time];
        } else {
          timeLine.result[time] += spider.countByTime[time];
        }
      }
    });

    return { spider: spiderPie, columnar: spiderColumnar, line: timeLine };
  }

  calculateSystem(system) {
    let systemPie = [];
    systemPie.push({ value: system.cpu, name: "CPU" });
    systemPie.push({ value: system.memory, name: "MEMORY" });
    return systemPie;
  }
}
