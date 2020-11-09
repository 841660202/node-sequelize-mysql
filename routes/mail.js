const KoaRouter = require('koa-router');
const mail = require("../utils/mailUtil")
const dayjs = require("dayjs")
const ejs = require("ejs");
// 路由加前缀 
const mailRouter = new KoaRouter({
  prefix: '/mail'
});
mailRouter.post('/send', async (ctx, next) => {
  const { data } = ctx.request.body
  try {
    const info = await mail.send(data || {})
    ctx.body = {
      code: '000000',
      msg: "邮件发送",
      data: info
    }
  } catch (error) {
    ctx.body = {
      code: '000001',
      msg: "邮件发送出问题啦",
      data: error
    }
  }
})
mailRouter.post('/send/html', async (ctx, next) => {
  const { data } = ctx.request.body
  const date = dayjs().format("YYYY-MM-DD")
  try {
    // ejs promise直接返回的是组装后的html
    const res = await ejs.renderFile('./views/mail-template.ejs', { ...data, date }, {})
    // console.log(res)
    const info = await mail.sendHtml(data, res);
    ctx.body = {
      code: '000000',
      msg: "邮件发送",
      data: info
    }
  } catch (error) {
    ctx.body = {
      code: '000001',
      msg: "邮件发送出问题啦",
      data: error
    }
  }
})
module.exports = mailRouter