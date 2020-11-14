const Store = require("../utils/redisUtil");
const { logger } = require("../utils/loggerUtil")
const userAgentUtil = require("../utils/userAgentUtil")
// 实例化
const redis = new Store();
// 定义允许直接访问的url
const allowpage = [
  '/login', '/api/login',
  '/session/page/login', "/session/loginAction",
  "/scan/page/app_login", "/scan/logout", "/scan/onlogin",
  "/scan/pc",
  "/scan/qrcode",
  "/scan/qrcode/img",
  "/scan/qrcode/scan_info",
  "/scan/page/auth",
];
// 正则匹配允许的文件
const reg = /.png|.jpeg|.svg|.html|.css|.js/
/**
 * 拦截中间件
 * 备注：以下使用english，是懒得看
 */
module.exports = function allowRouter() {
  return async function (ctx, next) {
    userAgentUtil.getClientIp(ctx)
    let url = ctx.originalUrl
    if (allowpage.indexOf(url) > -1 || reg.test(url)) {
      logger.info('无需校验资源')
      await next()
    } else {
      // 触发校验
      const SESSIONID = ctx.cookies.get('SESSIONID');
      const SESSION = await redis.get(SESSIONID);
      console.log("SESSION", SESSION)
      // 静态资源访问受限问题解决？？？
      if (!!SESSION) {
        if (url === '/') {
          ctx.redirect('/projectList')
        }
        // 有效请求，刷新redis时间
        logger.info(`valid req, refresh redis, SESSIONID=${SESSIONID}`)
        logger.info('login status validate success')
        redis.refresh(SESSIONID, SESSION)
        await next()
      } else {
        logger.warn('login status validate fail')
        logger.info(ctx.request.url)
        if (userAgentUtil.checkPhone(ctx)) {
          ctx.redirect('/scan/page/app_login')
        } else {
          ctx.redirect('/session/page/login')
        }
      }
    }
  }
}
// throw new TypeError('middleware must be a function!');