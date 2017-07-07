// @flow

const isNode = true;

let dcEmitter;

// 根据是否为 Node 环境来动态返回 EventEmitter
if (isNode) {
  const EventEmitter = require("events");

  class DeclarativeCrawlerEmitter extends EventEmitter {}

  // https://github.com/Olical/EventEmitter
  dcEmitter = new DeclarativeCrawlerEmitter();
} else {
  const EventEmitter = require("wolfy87-eventemitter");
  dcEmitter = new EventEmitter();
}

export default dcEmitter;
