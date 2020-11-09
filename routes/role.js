const KoaRouter = require('koa-router');
const dayjs = require('dayjs');
const { Role, Point, RolePoint, sequelize } = require("../models");
const { promiseImpl } = require('ejs');
// 路由加前缀 
const roleRouter = new KoaRouter({
  prefix: '/role'  // 路由加前缀
});
// 接口

// 查询全部
roleRouter.get('/all', async (ctx, next) => {
  const res = await Role.findAll()
  ctx.body = res
})
// 查询单个用户信息 role/2 这种不太好 role/page冲突
// roleRouter.get('/:id', async (ctx, next) => {
//   const { id } = ctx.params
//   if (typeof id !== 'number') {
//     ctx.body = {
//       msg: '请传参数'
//     }
//   }
//   const res = await Role.findOne({
//     where: {
//       id,
//     }
//   })
//   ctx.body = res
// })
// 查询单个用户信息 role?id=2
roleRouter.get('/', async (ctx, next) => {
  const { id } = ctx.query
  if (typeof id !== 'number') {
    ctx.body = {
      msg: '请传参数'
    }
  }
  const res = await Role.findOne({
    where: {
      id,
    }
  })
  ctx.body = res
})
// 获取分页
roleRouter.get('/map', async (ctx, next) => {
  const { pageNo, pageSize } = ctx.query
  const _pageNo = pageNo || 1
  const _pageSize = pageSize || 10
  const res = await Role.findAll({
    where: {
    },
    order: [
      // Will escape title and validate DESC against a list of valid direction parameters
      ['createdAt', 'DESC'],
      ['roleName', 'DESC'],
    ],
    include: [
      { model: Point, as: 'points' }
    ],
  })
  ctx.body = res
})
// 获取include指定参数
roleRouter.get('/map1', async (ctx, next) => {
  const { pageNo, pageSize } = ctx.query
  const _pageNo = pageNo || 1
  const _pageSize = pageSize || 10
  const res = await Role.findAll({
    where: {
    },
    attributes: ["id", "roleName"],
    include: [
      {
        model: Point,
        as: 'points',
        attributes: ["id", "pointName"],
        through: { attributes: [] } // 隐藏结果中不需要的 `PlayerGameTeam` 嵌套对象
      }
    ],
    // TODO 解决中间表显示的问题
  })
  ctx.body = res
})

// 新增
roleRouter.post('/save', async (ctx, next) => {
  const { roleName } = ctx.request.body
  try {
    const res = await Role.findOrCreate({
      where: { roleName },
    })
    console.log(res)
    if (res[1]) {
      ctx.body = {
        code: '000000',
        msg: "新增成功",
        data: res[1]
      }
    }
    else {
      ctx.body = {
        code: '000001',
        msg: "已存在，无需新增",
        data: res[1]
      }
    }
  } catch (error) {
    ctx.body = {
      code: '000001',
      msg: error.errors[0].message,
      data: false
    }
  }

})
roleRouter.post('/del/soft', async (ctx, next) => {
  const { roleName } = ctx.request.body
  const res = await Role.destroy({
    where: { roleName },
  })
  console.log(res)
  if (res === 1) {
    ctx.body = {
      code: '000000',
      msg: "删除成功",
      data: true
    }
  }
  else {
    ctx.body = {
      code: '000001',
      msg: "删除失败",
      data: false
    }
  }
})

// 新增 role point 
// 事务
// 关联插入
// 关联更新
// 关联删除
// 
roleRouter.post('/save/withPoints', async (ctx, next) => {
  // const { data } = ctx.request.body
  const data = {
    "roleName": "管理员1",
    "points": [
      {
        "pointName": "人员管理1"
      },
      {
        "pointName": "角色管理1"
      },
      {
        "pointName": "项目管理1"
      },
      {
        "pointName": "任务管理1"
      }
    ]
  }
  const res = await Role.create(data, {
    include: [
      {
        model: Point,
        as: 'points'
      }
    ]
  })
  console.log(res)
  ctx.body = {
    code: '000000',
    msg: "策四",
  }


  // const t = await sequelize.transaction();

  // try {
  //   // 角色未找到，插入 返回id,
  //   // 遍历一层，插入角色
  //   const { roleName } = (data || {})
  //   const role_res = await Role.findOrCreate({
  //     where: { roleName },
  //   }, { transaction: t })
  //   role_res[0]
  //   // 有角色的，返回id
  //   // 组装数据，
  //   const res = await Role.findOrCreate({
  //     where: { roleName },
  //   }, { transaction: t })
  //   // 角色未找到插入
  //   // const res = await Point.findOrCreate({
  //   //   where: { pointName },
  //   // }, { transaction: t })

  //   if (res[1]) {
  //     ctx.body = {
  //       code: '000000',
  //       msg: "新增成功",
  //       data: res[1]
  //     }
  //   }
  //   else {
  //     ctx.body = {
  //       code: '000001',
  //       msg: "已存在，无需新增",
  //       data: res[1]
  //     }
  //   }
  // } catch (error) {
  //   ctx.body = {
  //     code: '000002',
  //     msg: "事务回滚",
  //     data: error
  //   }
  // }


})

roleRouter.post('/update/withPoints', async (ctx, next) => {
  const { data } = ctx.request.body
  const roleData = {
    id: data.id,
    roleName: data.id
  }
  const { pointIds } = data
  const t = await sequelize.transaction();
  try {
    // 1、更新角色
    await Role.update({ roleName: data.roleName }, {
      where: {
        id: roleData.id
      },
      transaction: t
    })
    // 2、更新map

    // 2.1.批量解绑定
    await RolePoint.destroy({
      where: {
        roleId: roleData.id
      },
      transaction: t
    });
    // 2.2.批量绑定（执行的是批量插入数据）
    const bulkData = (pointIds || []).map(id => {
      return {
        pointId: id,
        roleId: roleData.id
      }
    })
    await RolePoint.bulkCreate(bulkData, { transaction: t });
    await t.commit();
    ctx.body = {
      code: '000000',
      msg: "操作成功",
      data: true,
    }
  } catch (error) {
    await t.rollback();
    ctx.body = {
      code: '000001',
      msg: "操作失败",
      data: error,
    }
  }
})




module.exports = roleRouter