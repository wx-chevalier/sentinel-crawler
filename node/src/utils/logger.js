const winston = require("winston");

// 打印错误日志
export const errorLogger = new winston.Logger({
  level: "error",
  transports: [
    new winston.transports.Console({
      timestamp: function() {
        return Date.now();
      },
      formatter: function(options) {
        // Return string will be passed to logger.
        return (
          options.timestamp() +
          " " +
          options.level.toUpperCase() +
          " " +
          (options.message ? options.message : "") +
          (options.meta && Object.keys(options.meta).length
            ? "\n\t" + JSON.stringify(options.meta)
            : "")
        );
      }
    }),
    new winston.transports.File({ filename: "dc.error.log" })
  ]
});
