const Store = require("../utils/redisUtil");
const logger = require("../utils/loggerUtil")
const redis = new Store();
//定义允许直接访问的url
const allowpage = ['/login', '/api/login', '/session/page/login', "/session/loginAction"];
const reg = /.png|.jpeg|.svg|.html|.css|.js/
//拦截
async function pageFilter(ctx) {
  let url = ctx.originalUrl
  if (allowpage.indexOf(url) > -1 || reg.test(url)) {
    console.log()
    logger.info('当前地址可直接访问')
    return true
  } else {
    // 触发校验
    // const method = ctx.request.method;
    const SESSIONID = ctx.cookies.get('SESSIONID');
    logger.trace("SESSIONID", SESSIONID)
    const SESSION = await redis.get(SESSIONID);
    // 静态资源访问受限问题解决？？？
    // if (ctx.isAuthenticated()) {
    if (!!SESSION) {
      if (url === '/') {
        ctx.redirect('/projectList')
      }
      // 有效请求，刷新redis时间
      logger.info(`有效请求，刷新redis时间:${SESSIONID}`)
      redis.refresh(SESSIONID, SESSION)
      logger.info('login status validate success')
      return true
    } else {
      logger.warn('login status validate fail')
      logger.info(ctx.request.url)
      ctx.redirect('/session/page/login')
      return false
    }
  }
}
module.exports = pageFilter