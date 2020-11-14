/**
 * 扫码登录
 */
const { Op } = require('sequelize')
const { User } = require("../models")
const KoaRouter = require('koa-router');
const Store = require("../utils/redisUtil");
const tokenStore = require("../utils/tokenUtil");
const codeUtil = require("../utils/codeUtil");
const { SCAN_MAX_AGE } = require("../consts/scan");
const uuid = require("uuid");
const { logger } = require('../utils/loggerUtil');
const redis = new Store();
// 路由加前缀 
const scanRouter = new KoaRouter({
  prefix: '/scan'
});
// PC端扫码登陆页面
scanRouter.get('/pc', async (ctx, next) => {
  console.log("ctx.session......", ctx.session)
  const _uuid = uuid.v1()
  await tokenStore.set({ name: 1 }, { sid: `Scan_Token:${_uuid}`, maxAge: SCAN_MAX_AGE })
  const data = await tokenStore.get(`Scan_Token:${_uuid}`)
  console.log(data)
  ctx.cookies.set('scan_token', _uuid, { signed: true, maxAge: SCAN_MAX_AGE });
  await ctx.render("qr_login/pc_login", {
  })
})
// PC端生成二维码相关信息(暂时未使用)
scanRouter.post('/qrcode', async (ctx, next) => {
  ctx.body = {
    token: 1
  }
})
// PC端生成二维码图片
scanRouter.post('/qrcode/img', async (ctx, next) => {
  // const { code } = ctx.params
  ctx.set('content-type', 'image/png'); //设置返回类型
  const scanToken = ctx.cookies.get("scan_token")
  const img = await codeUtil.QRCode(scanToken, { type: 'png' });
  ctx.body = img
})
// PC端定时获取扫描状态信息
scanRouter.post('/qrcode/scan_info', async (ctx, next) => {
  const code = ctx.cookies.get("scan_token")
  const data = await tokenStore.get(`Scan_Token:${code}`)
  if (!!data) {
    // 移动端确认
    if (data.status === 2) {
      ctx.session.uid = data.data
      ctx.session.uid = data.data.uid
      await tokenStore.destroy(`Scan_Token:${code}`)
    }
    ctx.success(data)
  } else {
    ctx.fail('临时token过期了', '000001')
  }

})
// mobile web 首页
scanRouter.get('/page/app_home', async (ctx, next) => {
  const SESSIONID = ctx.cookies.get('SESSIONID');
  const redisData = await redis.get(SESSIONID);
  console.log(redisData)
  const res = await User.findOne({
    where: {
      id: {
        [Op.eq]: redisData.uid
      },
    }
  })
  await ctx.render("qr_login/app_home", {
    email: res.email
  })
})
// mobile web 登录页面
scanRouter.get('/page/app_login', async (ctx, next) => {
  await ctx.render("qr_login/app_login")
})
// 退出
scanRouter.get('/onlogout', async (ctx, next) => {
  const SESSIONID = ctx.cookies.get('SESSIONID');
  await redis.destroy(SESSIONID)
  ctx.redirect('/scan/page/app_login')
})
// 登录 移动端登录
scanRouter.post('/onlogin', async (ctx, next) => {
  const { email } = ctx.request.body
  try {
    const userInfo = await User.findOne({
      where: {
        email: {
          [Op.eq]: email
        }
      }
    })
    if (!userInfo) {
      ctx.body = {
        code: '000000',
        data: true,
        msg: "未注册，请先注册"
      }
    }
    ctx.session.uid = JSON.stringify(userInfo.id);
    ctx.redirect('/scan/page/app_home')
  } catch (error) {
    ctx.body = error
  }

})
// 扫码了
scanRouter.post('/account/scan', async (ctx, next) => {
  //  通过码，更改scanToken的status
  const { code } = ctx.query
  await tokenStore.set({ status: 1 }, { sid: `Scan_Token:${code}`, maxAge: SCAN_MAX_AGE })
  ctx.success("已扫描等待确认")
})
scanRouter.get('/page/auth', async (ctx, next) => {
  //  通过码，更改scanToken的status
  const { code } = ctx.query
  await tokenStore.set({ status: 1 }, { sid: `Scan_Token:${code}`, maxAge: SCAN_MAX_AGE })
  // ctx.success("已扫描等待确认")
  await ctx.render("qr_login/app_auth",{code})
})
// 确认了
scanRouter.post('/confirm/scan', async (ctx, next) => {
  const { code, confirm } = ctx.request.body
  switch (confirm) {
    // 这里加了时间了，是有缺陷的
    case true:
      const SESSIONID = ctx.cookies.get('SESSIONID');
      const redisData = await redis.get(SESSIONID);
      await tokenStore.set({ status: 2, data: redisData }, { sid: `Scan_Token:${code}`, maxAge: SCAN_MAX_AGE })
      ctx.success("移动端点了确认")
      break;
    case false:
      await tokenStore.set({ status: 5 }, { sid: `Scan_Token:${code}`, maxAge: SCAN_MAX_AGE })
      ctx.success("移动端点了拒绝")
      break;

    default:
      logger.error(code, confirm)
      break;
  }
})
module.exports = scanRouter