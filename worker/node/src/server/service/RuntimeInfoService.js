// @flow
const pusage = require('pidusage');
const os = require('os');

export default class RuntimeInfoService {
  /**
   * Description 获取操作系统信息
   * @returns {Promise}
   */
  static async getOSInfo() {
    return new Promise(resolve => {
      pusage.stat(process.pid, function(err, stat) {
        resolve({
          cpu: stat.cpu,
          memory: 1 - stat.memory / os.totalmem()
        });
      });
    });
  }
}
