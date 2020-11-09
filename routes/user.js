const KoaRouter = require('koa-router');
const dayjs = require('dayjs');
const { User, Role } = require("../models")
const { Op } = require("sequelize");
// 路由加前缀 
const userRouter = new KoaRouter({
  prefix: '/user'  // 路由加前缀
});
// 接口

// 查询全部
userRouter.get('/all', async (ctx, next) => {
  const { enable } = ctx.query // 传进来的是字符串
  console.log("enable", enable, typeof enable)
  const res = await User.findAll({
    paranoid: parseInt(enable) === 1
  })
  ctx.body = res
})
userRouter.get('/all/by', async (ctx, next) => {
  const { enable } = ctx.query // 传进来的是字符串
  let res = null;
  switch (enable) {
    case '1':
      res = await User.findAll({
        where: {
          destroyTime: {
            [Op.eq]: null
          }
        },
        paranoid: false
      })
      break;
    case '0':
      res = await User.findAll({
        where: {
          destroyTime: {
            [Op.ne]: null
          }
        },
        paranoid: false
      })
      break;
    case 'null':
      res = await User.findAll({
        paranoid: false
      })
      break;
    default:
      break;
  }
  // const res = await User.findAll({
  //   where: {
  //     destroyTime: {
  //       [Op.eq]: null
  //     }
  //   },
  // })
  ctx.body = res
})
// 查询单个用户信息 user/2 这种不太好 user/page冲突
// userRouter.get('/:id', async (ctx, next) => {
//   const { id } = ctx.params
//   if (typeof id !== 'number') {
//     ctx.body = {
//       msg: '请传参数'
//     }
//   }
//   const res = await User.findOne({
//     where: {
//       id,
//     }
//   })
//   ctx.body = res
// })
// 查询单个用户信息 user?id=2
userRouter.get('/', async (ctx, next) => {
  const { id } = ctx.query
  if (typeof id !== 'number') {
    ctx.body = {
      msg: '请传参数'
    }
  }
  const res = await User.findOne({
    where: {
      id,
    }
  })
  ctx.body = res
})
// 获取分页
userRouter.get('/page', async (ctx, next) => {
  const { pageNo, pageSize } = ctx.query
  const _pageNo = pageNo || 1
  const _pageSize = pageSize || 10
  const res = await User.findAndCountAll({
    where: {
    },
    limit: _pageSize,
    offset: (_pageNo - 1) * _pageSize
  })
  ctx.body = res
})
// 获取分页
userRouter.get('/withRole', async (ctx, next) => {
  const { pageNo, pageSize } = ctx.query
  const _pageNo = pageNo || 1
  const _pageSize = pageSize || 10
  const res = await User.findAndCountAll({
    where: {
    },
    include: {
      model: Role
    },
    limit: _pageSize,
    offset: (_pageNo - 1) * _pageSize
  })
  ctx.body = res
})
// 获取分页,限制返回字段
userRouter.get('/withRoleAtt', async (ctx, next) => {
  const { pageNo, pageSize } = ctx.query
  const _pageNo = pageNo || 1
  const _pageSize = pageSize || 10
  const res = await User.findAndCountAll({
    where: {
    },
    attributes: ["id", "firstName", "lastName", "email"],
    include: {
      model: Role,
      as: 'roles',
      attributes: ["id", "roleName"]
    },
    limit: _pageSize,
    offset: (_pageNo - 1) * _pageSize
  })
  ctx.body = res
})
// 软删除
userRouter.post('/disable', async (ctx, next) => {
  const { data } = ctx.request.body
  let res = null;
  // 启用
  if (data.enable) {
    res = await User.restore({
      where: {
        id: data.id
      },
    })
    // 停用
  } else {
    res = await User.destroy({
      where: {
        id: data.id
      },
    })
  }

  ctx.body = res
})

module.exports = userRouter