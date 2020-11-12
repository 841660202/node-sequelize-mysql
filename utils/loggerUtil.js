const log4js = require("log4js")
var log4js_config = require("../config/log4js.json");
log4js.configure(log4js_config)
// const logger = log4js.getLogger();
// 配置输出等级
// logger.level = "debug"

const logUtil = {
  logger: log4js.getLogger("app"),
  httpLog: log4js.getLogger("http"),
  err: log4js.getLogger(),
}

module.exports = logUtil;

