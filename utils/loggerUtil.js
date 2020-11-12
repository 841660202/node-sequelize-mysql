const log4js = require("log4js")
const logger = log4js.getLogger();
// 配置输出等级

logger.level = "debug"
// logger.level = "OFF"

module.exports = logger;

