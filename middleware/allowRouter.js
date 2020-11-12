const Store = require("../utils/redisUtil");
const { logger } = require("../utils/loggerUtil")
// 实例化
const redis = new Store();
// 定义允许直接访问的url
const allowpage = ['/login', '/api/login', '/session/page/login', "/session/loginAction"];
// 正则匹配允许的文件
const reg = /.png|.jpeg|.svg|.html|.css|.js/
/**
 * 拦截中间件
 * 备注：以下使用english，是懒得看
 */
module.exports = function allowRouter() {
  return async function (ctx, next) {
    let url = ctx.originalUrl
    if (allowpage.indexOf(url) > -1 || reg.test(url)) {
      logger.info('无需校验资源')
      await next()
    } else {
      // 触发校验
      const SESSIONID = ctx.cookies.get('SESSIONID');
      const SESSION = await redis.get(SESSIONID);
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
        ctx.redirect('/session/page/login')
      }
    }
  }
}
// throw new TypeError('middleware must be a function!');