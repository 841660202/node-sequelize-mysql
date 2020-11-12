const KoaRouter = require('koa-router');
const { User, Role } = require("../models")
const { Op } = require("sequelize");
const Store = require("../utils/redisUtil");
const delay = require("../utils/delayUtil");
const timeUtil = require("../utils/timeUtil");
const redis = new Store();
// 路由加前缀 
const sessionRouter = new KoaRouter({
  prefix: '/session'  // 路由加前缀
});
// 接口
sessionRouter.get('/page/login', async (ctx, next) => {
  await ctx.render("login")
})
sessionRouter.post('/loginAction', async (ctx, next) => {
  console.log(ctx.request.body)
  const { email, waiting } = ctx.request.body
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
    await delay(waiting || 0)
    ctx.session.uid = JSON.stringify(userInfo.id);
    ctx.body = {
      code: '000000',
      data: true,
      msg: userInfo
    }
  } catch (error) {
    ctx.body = error
  }
})
sessionRouter.post('/set', async (ctx, next) => {
  console.log(ctx.request)
  const { email } = ctx.request.body
  try {
    const userInfo = await User.findOne({
      where: {
        email: {
          [Op.eq]: email
        }
      }
    })
    console.log(userInfo)
    ctx.session.uid = JSON.stringify(userInfo.id);
    ctx.body = userInfo
  } catch (error) {
    ctx.body = error
  }
})


sessionRouter.get('/get', async (ctx, next) => {
  const SESSIONID = ctx.cookies.get('SESSIONID');
  console.log("SESSIONID", SESSIONID)
  const redisData = await redis.get(SESSIONID);
  console.log(redisData)
  ctx.body = ctx.cookies.get("uid")
})
// 用户列表界面
sessionRouter.get('/page/users', async (ctx, next) => {
  res = await User.findAll({
    // where: {
    //   destroyTime: {
    //     [Op.eq]: null
    //   }
    // },
    paranoid: false
  })
  await ctx.render("users", {
    users: res
    // users: res.map(item => {
    //   return {
    //     ...item,
    //     updatedAt: timeUtil.date(item.updatedAt)
    //   }
    // })
  })
})
// ajax获取用户列表数据
sessionRouter.get('/view/users/data', async (ctx, next) => {
  res = await User.findAll({
    paranoid: false
  })
  ctx.body = {
    code: '000000',
    msg: '操作成功',
    data: res
    // data: res.map(item => {
    //   return {
    //     ...item,
    //     updatedAt: timeUtil.date(item.updatedAt)
    //   }
    // })
  }
})
// 新增页面
sessionRouter.get('/page/user/add', async (ctx, next) => {
  const data = await Role.findAll({
    attributes: ["id", "roleName"],
  })
  await ctx.render("users-add", {
    roles: data.map(item => {
      return {
        id: item.id,
        name: item.roleName
      }
    })
  })
})
// 新增ajax接口
sessionRouter.post('/user/add', async (ctx, next) => {
  const { email, roleId, firstName, lastName } = ctx.request.body
  console.log("邮箱:", email, "角色id", roleId, "角色id typeof", typeof roleId)
  try {
    const res = await User.findOrCreate({
      where: { email, roleId: parseInt(roleId), firstName, lastName },
    })
    if (!res || !res[1]) {
      ctx.body = {
        code: '000000',
        msg: '操作失败，数据已存在',
        data: false
      }
    } else {
      ctx.body = {
        code: '000000',
        msg: '操作成功',
        data: email
      }
    }
  } catch (error) {
    ctx.body = {
      code: '000000',
      msg: error.errors[0].message,
      data: false
    }
  }

})
sessionRouter.post('/view/users/enable', async (ctx, next) => {
  const { id, status } = ctx.request.body
  console.log(id, status)
  // res = await User.findAll({
  //   paranoid: false
  // })
  let res = null
  if (parseInt(status) === 1) {
    res = await User.restore({
      where: {
        id: {
          [Op.eq]: id
        }
      }
    })
  } else {
    res = await User.destroy({
      where: {
        id: {
          [Op.eq]: id
        }
      }
    })
  }
  console.log(res)
  ctx.body = {
    code: '000000',
    msg: '操作成功',
    data: res
  }
})


module.exports = sessionRouter