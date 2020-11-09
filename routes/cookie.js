const KoaRouter = require('koa-router');
const mail = require("../utils/mailUtil")
const dayjs = require("dayjs")
const ejs = require("ejs");
// 路由加前缀 
const cookieRouter = new KoaRouter({
  prefix: '/cookie'
});
cookieRouter.get('/set', async (ctx, next) => {
  ctx.cookies.set('username', 'lisa', {
    domain: 'localhost',
    path: '/',   //cookie写入的路径
    maxAge: 1000 * 60 * 60 * 1,
    expires: new Date('2018-07-06'),
    httpOnly: false,
    overwrite: false
  });
  ctx.body = {
    code: '000000',
    msg: 'cookies is seted;',
    data: true
  }
})
cookieRouter.get('/get', async (ctx, next) => {
  console.log(ctx.cookies)
  console.log(ctx.cookies.get("username"))
  ctx.body = {}
})
module.exports = cookieRouter