const Koa = require('koa');
const app = new Koa();
const glob = require('glob')
const path = require("path")
const views = require('koa-views');
const bodyParser = require('koa-bodyparser')

// logger
app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.get('X-Response-Time');
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});
// filter
const pageFilter = require('./filter/allowPage');
//session拦截
app.use(async (ctx, next) => {
  const res = await pageFilter(ctx)
  console.log(res)
  await next()
})
// redis
const session = require("koa-session2");
const Store = require("./utils/redisUtil"); //redis
// session配置
app.use(session({
  store: new Store(),
  key: "SESSIONID",
}));

const serve = require('koa-static')
// 指定 public目录为静态资源目录，用来存放 js css images 等
console.log(__dirname + "/public")
app.use(serve(__dirname + "/public"))

app.use(
  views("views", {
    map: {
      html: "ejs"
    }
  })
);



app.use(bodyParser())


// x-response-time
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

// 使用脚本形式引入，避免手动引入
// response
glob("./routes/**/*.js", {}, function (er, files) {
  (files || []).forEach(path => {
    app.use(require(path).routes())
  })
})
// views
app.use(views('views', { map: { html: 'ejs' } }));
app.listen(3000);