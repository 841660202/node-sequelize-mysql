const Store = require("../utils/redisUtil");
const redis = new Store();
//定义允许直接访问的url
const allowpage = ['/login', '/api/login', '/session/login', "/session/loginAction"];
const reg = /.png|.jpeg|.svg|.html|.css|.js/
//拦截
async function pageFilter(ctx) {
  let url = ctx.originalUrl
  if (allowpage.indexOf(url) > -1 || reg.test(url)) {
    console.log('当前地址可直接访问')
    return true
  } else {
    // 触发校验
    // const method = ctx.request.method;
    // console.log(method)
    const SESSIONID = ctx.cookies.get('SESSIONID');
    console.log("SESSIONID", SESSIONID)
    const SESSION = await redis.get(SESSIONID);
    // 静态资源访问受限问题解决？？？
    // if (ctx.isAuthenticated()) {
    if (!!SESSION) {
      if (url === '/') {
        ctx.redirect('/projectList')
      }
      // 有效请求，刷新redis时间
      console.log(`有效请求，刷新redis时间:${SESSIONID}`)
      redis.refresh(SESSIONID, SESSION)
      console.log('login status validate success')
      return true
    } else {
      console.log('login status validate fail')
      console.log(ctx.request.url)
      ctx.redirect('/session/login')
      return false
    }
  }
}
module.exports = pageFilter