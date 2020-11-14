const Koa = require('koa');
const app = new Koa();
const glob = require('glob')
const path = require("path")
const views = require('koa-views');
const bodyParser = require('koa-bodyparser')
const {logger, httpLog} = require('./utils/loggerUtil')
const allowRouter = require('./middleware/allowRouter');
const response = require('./middleware/response');
app.keys = ['im a newer secret', 'i like turtle'];
// logger
app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.get('X-Response-Time');
  httpLog.info(`${ctx.method} ${ctx.url} - ${rt}`)
  if(ctx.method === "GET"){
  }else{
    httpLog.info(`${ctx.method} 参数: ${JSON.stringify(ctx.request.body)}`)
  }
});
//session拦截
app.use(allowRouter())
app.use(response())
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
app.listen(3009);