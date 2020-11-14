### 目的：主要是为了学习 node koa sequelize，或许以后用的到

- mysql、cookie、sso(单站点登录)、redis、node、koa、nodemailer、dayjs、模版引擎（ejs、mustache）、爬虫（cheerio、Puppeteer）、断点续传、socket、token、sequelize、sequelize-cli、nodemon、vscode node 调试...碎片化学了好多也好久，没整合在一起使用过，这次试试水

- 已用： mysql、cookie、redis、node、koa、nodemailer、dayjs、ejs、sequelize-cli、sequelize、nodemon、vscode node 调试
- 本次学到了中间件【统一数据返回】、【校验信息】（ cookie校验及延长有效时间）
- 待续：爬虫、断点续传

### 文件夹说明
- ./temp ./screen 为不重要文件夹，开发过程中备份或作其他用途
- sevices为复杂业务代码书写文件夹
- consts 为业务代码中需要的常量
### 正则
```
固定电话或者手机号
/^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/

密码长度不少于8位，且包含大、小写字母、数字以及特殊符号！
/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+|{}?><\-\]\\[\\/])[^]{8,}$/

```
### 项目说明

- rotues/cookie、rotues/mail、rotues/role、rotues/user 基本上都是接口
- rotues/session 接口+ ejs 渲染
- http.http 接口测试文件，我个人觉得 postman 并没有.http 文件好用，从方便上，同一个应用点文件测试快还是打开一个新应用快，有道理没？
- 建模玩的还不够 6，sequelize 文档看了有四五遍了，先写一段时间代码，回头再看【学、思、练】

```
cnpm install --save sequelize
cnpm install --save mysql2
cnpm install -g sequelize-cli
```

```
sequelize model:generate --name Role --attributes roleName:string
sequelize model:generate --name Point --attributes pointName:string
sequelize model:generate --name User --attributes firstName:string,lastName:string,email:string
sequelize migration:create --name Point-AddRoleId
sequelize db:migrate
sequelize seed:generate --name demo-point
sequelize db:seed:all
sequelize model:generate --name RolePoint --attributes roleId:INTEGER,pointId:INTEGER
sequelize seed:generate --name demo-rolePoint
```

#### 要加一个软件删除

```
paranoid: true,
// If you want to give a custom name to the deletedAt column
deletedAt: 'destroyTime'

// 删除好像是按照deletedAt来控制的，deletedAt有就是软删除，无，则是启用
```

[参考文档](https://demopark.github.io/sequelize-docs-Zh-CN/core-concepts/paranoid.html)

```
userRouter.get('/all', async (ctx, next) => {
  const { enable } = ctx.query // 传进来的是字符串
  console.log("enable",enable, typeof enable)
  const res = await User.findAll({
    paranoid: parseInt(enable) === 1 // 默认true ,仅查询未删除，false,查询全部
  })
  ctx.body = res
})
```

```


chenhailong@chenhailongdeMacBook-Pro:/Volumes/SSD/github/node/sequelize$ sequelize db:migrate

Sequelize CLI [Node: 14.15.0, CLI: 6.2.0, ORM: 6.3.5]

Loaded configuration file "config/config.json".
Using environment "development".
No migrations were executed, database schema was already up to date.
chenhailong@chenhailongdeMacBook-Pro:/Volumes/SSD/github/node/sequelize$ sequelize migration:create --name User-AddRoleId

Sequelize CLI [Node: 14.15.0, CLI: 6.2.0, ORM: 6.3.5]

migrations folder at "/Volumes/SSD/github/node/sequelize/migrations" already exists.
New migration was created at /Volumes/SSD/github/node/sequelize/migrations/20201104075736-User-AddRoleId.js .
chenhailong@chenhailongdeMacBook-Pro:/Volumes/SSD/github/node/sequelize$ sequelize db:migrate

Sequelize CLI [Node: 14.15.0, CLI: 6.2.0, ORM: 6.3.5]

Loaded configuration file "config/config.json".
Using environment "development".
== 20201104075736-User-AddRoleId: migrating =======

ERROR: addColumn takes at least 3 arguments (table, attribute name, attribute definition)

chenhailong@chenhailongdeMacBook-Pro:/Volumes/SSD/github/node/sequelize$ sequelize db:migrate

Sequelize CLI [Node: 14.15.0, CLI: 6.2.0, ORM: 6.3.5]

Loaded configuration file "config/config.json".
Using environment "development".
== 20201104075736-User-AddRoleId: migrating =======

ERROR: Cannot add foreign key constraint

chenhailong@chenhailongdeMacBook-Pro:/Volumes/SSD/github/node/sequelize$ sequelize db:migrate

Sequelize CLI [Node: 14.15.0, CLI: 6.2.0, ORM: 6.3.5]

Loaded configuration file "config/config.json".
Using environment "development".
== 20201104075736-User-AddRoleId: migrating =======
== 20201104075736-User-AddRoleId: migrated (0.050s)

```

总结：
1、新增一个 migration

```
sequelize migration:create --name User-AddRoleId
```

2、编写 migrationn up 和 down 方法

```
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('users', "roleId", { // name of the key we're adding
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'roles', // name of Target model
        key: 'id', // key in Target model that we're referencing
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('users', 'roleId');
  }
};


```

3、执行更新 sequelize db:migrate

```

```

### 注意事项

删除

```
DELETE FROM `Roles` WHERE `roleName` = 1

  SequelizeDatabaseError: Truncated incorrect DOUBLE value: '管理员'




const { roleName } = ctx.request.body
  const res = await Role.destroy({
    where: { roleName },
  })

Executing (default): DELETE FROM `Roles` WHERE `roleName` = '1'


// 因为roleName是string类型，如果是新增默认存在自动转换，如果是删除则不存自动转换，就会出现上述报错
```

### 校验

```
 Role.init({
    roleName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      set(value) {
        // Storing passwords in plaintext in the database is terrible.
        // Hashing the value with an appropriate cryptographic hash function is better.
        this.setDataValue('roleName', value);
      },
    },
  }, {
    sequelize,
    modelName: 'Role',
    validate: { // ---------这里
      isString() {
        if (typeof this.roleName !== 'string') {
          throw new Error('roleName: 需要传入字符串!');
        }
      }
    }
  });

```

```
Role.init({
    roleName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      set(value) {
        // Storing passwords in plaintext in the database is terrible.
        // Hashing the value with an appropriate cryptographic hash function is better.
        this.setDataValue('roleName', value);
      },
      validate: {
        isString(value) {
          if (typeof value !== 'string') {
            throw new Error('roleName: 需要传入字符串!');
          }
        }
      }
    },
  }, {
    sequelize,
    modelName: 'Role',
    // validate: {
    //   isString() {
    //     if (typeof this.roleName !== 'string') {
    //       throw new Error('roleName: 需要传入字符串!');
    //     }
    //   }
    // }
  });
注意如果参数传null就会提示null，原因是sql级优先于validate

```

### 测试事务回滚

```
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
        roleId: "null"  // 特意写个错的
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

```

```
Executing (0a57052d-7cac-4504-8fd7-a2a4474e72c4): START TRANSACTION;
Executing (0a57052d-7cac-4504-8fd7-a2a4474e72c4): UPDATE `Roles` SET `roleName`=?,`updatedAt`=? WHERE `id` = ?
Executing (0a57052d-7cac-4504-8fd7-a2a4474e72c4): DELETE FROM `RolePoints` WHERE `roleId` IS NULL
Executing (0a57052d-7cac-4504-8fd7-a2a4474e72c4): INSERT INTO `RolePoints` (`roleId`,`pointId`,`createdAt`,`updatedAt`) VALUES (24,5,'2020-11-07 14:38:21','2020-11-07 14:38:21'),(24,6,'2020-11-07 14:38:21','2020-11-07 14:38:21'),(24,7,'2020-11-07 14:38:21','2020-11-07 14:38:21');
Executing (0a57052d-7cac-4504-8fd7-a2a4474e72c4): COMMIT;
POST /role/update/withPoints - 72ms
[nodemon] restarting due to changes...
[nodemon] starting `node app.js`
Executing (cfd3d53d-8d9c-43ce-9009-6af5d85377fc): START TRANSACTION;
Executing (cfd3d53d-8d9c-43ce-9009-6af5d85377fc): UPDATE `Roles` SET `roleName`=?,`updatedAt`=? WHERE `id` = ?
Executing (cfd3d53d-8d9c-43ce-9009-6af5d85377fc): DELETE FROM `RolePoints` WHERE `roleId` = 'null'
Executing (cfd3d53d-8d9c-43ce-9009-6af5d85377fc): ROLLBACK;

```

### 表增加一个字段

```
 await queryInterface.addColumn('users', "destroyTime", { // name of the key we're adding
      type: Sequelize.DATE,
      allowNull: true, // 如果数据库有数据，此处再写allowNull:false ERROR: Incorrect datetime value: '0000-00-00 00:00:00' for column 'destroyTime' at row 1
    });
```

- 错了也不报错，结果是不对的

```
 case '0':
  res = await User.findAll({
    where: {
      destroyTime: {
        [Op.ne]: null //  [Op.ne]: null 写成[Op.neq]: null  竟然不报错，一脸的懵逼
      }
    },
    paranoid: false
  })
  break;

```

### ctx.query 传进来的是字符串

```
const { enable } = ctx.query // 传进来的是字符串

```

### 邮件发送

[文档](https://nodemailer.com/about/?spm=a2c6h.14275010.0.0.6c6f5b7bw9B8zO)

```
{
  "code": "000001",
  "msg": "邮件发送出问题啦",
  "data": {
    "code": "EAUTH",
    "response": "535 Error: authentication failed",
    "responseCode": 535,
    "command": "AUTH PLAIN"
  }
}

IBTPSQKXHMIYTFBN

```

### 静态文件

```

const serve = require('koa-static')
// 指定 public目录为静态资源目录，用来存放 js css images 等
console.log(__dirname + "/public")
app.use(serve(__dirname + "/public"))

http://localhost:3000/index.html
```

### 制作 logo

```
https://app.brandmark.io/v2/
svgexport

```

### koa2 实现拦截器进行登录前 session 校验

[参考文章](https://www.cnblogs.com/beileixinqing/p/9273243.html)

### koa-passport

> 是 koa 的一个中间件，它实际上只是对 passport 的一个封装。利用 koa-passport 可以简便的实现登录注册功能，不但包括本地验证，还有很多提供第三方登录的模块可以使用

### 表单获取 7 种方式

[参考文档](https://www.cnblogs.com/52fhy/p/3969824.html)

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>表单对象--获取表单值的7种方式</title>
  </head>
  <body>
    <form action="" name="myform">
      <input type="text" name="user" value="admin" />
    </form>

    <script>
      document.write(document.myform.user.value + "1<br/>");
      document.write(document["myform"].user.value + "2<br/>");
      document.write(document.forms.myform.user.value + "3<br/>");
      document.write(document.forms[0].user.value + "5<br/>");
      document.write(document.forms["myform"].user.value + "4<br/>");
      document.write(document.forms.item(0).user.value + "6<br/>");
      document.write(document.forms.item("myform").user.value + "7<br/>"); //FF可能不支持
    </script>
  </body>
</html>
```

### 刷新 cookie 过期时间（服务端刷新）

```js
const Store = require("../utils/redisUtil");
const redis = new Store();
//定义允许直接访问的url
const allowpage = [
  "/login",
  "/api/login",
  "/session/login",
  "/session/loginAction",
];
const reg = /.png|.jpeg|.svg|.html|.css|.js/;
//拦截
async function pageFilter(ctx) {
  let url = ctx.originalUrl;
  if (allowpage.indexOf(url) > -1 || reg.test(url)) {
    console.log("当前地址可直接访问");
    return true;
  } else {
    // 触发校验
    // const method = ctx.request.method;
    // console.log(method)
    const SESSIONID = ctx.cookies.get("SESSIONID");
    console.log("SESSIONID", SESSIONID);
    const SESSION = await redis.get(SESSIONID);
    // 静态资源访问受限问题解决？？？
    // if (ctx.isAuthenticated()) {
    if (!!SESSION) {
      if (url === "/") {
        ctx.redirect("/projectList");
      }
      // 有效请求，刷新redis时间
      console.log(`有效请求，刷新redis时间:${SESSIONID}`);
      redis.refresh(SESSIONID, SESSION);
      console.log("login status validate success");
      return true;
    } else {
      console.log("login status validate fail");
      console.log(ctx.request.url);
      ctx.redirect("/session/login");
      return false;
    }
  }
}
module.exports = pageFilter;
```

```js
const Redis = require("ioredis");
const { Store } = require("koa-session2");

class RedisStore extends Store {
  constructor() {
    super();
    this.redis = new Redis();
  }

  async get(sid, ctx) {
    let data = await this.redis.get(`SESSION:${sid}`);
    return JSON.parse(data);
  }

  async set(
    session,
    { sid = this.getID(24), maxAge = 1000 * 60 * 60 } = {},
    ctx
  ) {
    try {
      console.log(`SESSION:${sid}`);
      // Use redis set EX to automatically drop expired sessions
      await this.redis.set(
        `SESSION:${sid}`,
        JSON.stringify(session),
        "EX",
        maxAge / 1000
      );
    } catch (e) {}
    return sid;
  }
  // 刷新 redis时间
  async refresh(sid, session, maxAge = 1000 * 60 * 60, ctx) {
    try {
      console.log(`SESSION:${sid}`);
      // Use redis set EX to automatically drop expired sessions
      await this.redis.set(
        `SESSION:${sid}`,
        JSON.stringify(session),
        "EX",
        maxAge / 1000
      );
    } catch (e) {}
    return sid;
  }

  async destroy(sid, ctx) {
    return await this.redis.del(`SESSION:${sid}`);
  }
}

module.exports = RedisStore;
```

### 原生模拟下拉选择

[参考文章](https://blog.csdn.net/cynthia101/article/details/104048276?utm_medium=distribute.pc_aggpage_search_result.none-task-blog-2~all~first_rank_v2~rank_v28-6-104048276.nonecase&utm_term=%E5%8E%9F%E7%94%9Fjs%E6%A8%A1%E6%8B%9Fselect&spm=1000.2123.3001.4430)

### dataset

[参考文章](https://blog.csdn.net/wsxujiacheng/article/details/75382075)

### `window.history.go(-1)`缓存

<img src="https://github.com/841660202/node-sequelize-mysql/tree/main/screen/iShot2020-11-09 14.50.30.png" width="50%">

### 时间格式化

- 在 routes 处理返回的数据会有 sequelize 乱七八糟的无用信息
- 在 model 中 get 处理

```js
User.init(
  {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    createdAt: {
      //这里
      type: DataTypes.DATE,
      get() {
        return dayjs(this.getDataValue("createdAt")).format(
          "YYYY-MM-DD HH:mm:ss"
        );
      },
    },
    updatedAt: {
      //这里
      type: DataTypes.DATE,
      get() {
        return dayjs(this.getDataValue("updatedAt")).format(
          "YYYY-MM-DD HH:mm:ss"
        );
      },
    },
  },
  {
    sequelize,
    modelName: "User",
    paranoid: true,
    // If you want to give a custom name to the deletedAt column
    deletedAt: "destroyTime",
    validate: {
      bothCoordsOrNone() {
        console.log(this.roleId, "this.roleId ");
        // if ((this.latitude === null) !== (this.longitude === null)) {
        //   throw new Error('Either both latitude and longitude, or neither!');
        // }
        if (typeof this.roleId !== "number") {
          throw new Error("新建用户需要绑定角色!");
        }
      },
    },
  }
);
```

### 字符串模版内嵌套 JSON.stringify 对于时间会出现引号错位

- 数据将要被点击使用
  <img src="https://github.com/841660202/node-sequelize-mysql/tree/main/screen/iShot2020-11-09 16.18.56.png" width="50%">

```js
function handleRefresh() {
  // dom更新
  request({
    url: "/session/view/users/data",
    method: "GET",
    data: {},
    success: function (res) {
      if (res) {
        const tableContent = document.getElementById("tableContent");
        const table = document.getElementById("table");
        let tpl = `<tbody id="tableContent">
            <thead>
              <tr>
                <th>lastName</th>
                <th>firstName</th>
                <th>email</th>
                <th>更新时间</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>`;
        const data = res.data;
        for (let i = 0; i < (data || []).length; i++) {
          tpl +=
            `
                <tr>
                  <td>${data[i].lastName ? data[i].lastName : "---"}</td>
                  <td>${data[i].firstName ? data[i].firstName : "---"}</td>
                  <td>${data[i].email}</td>
                  <td>${data[i].updatedAt}</td>
                  ${
                    data[i].destroyTime
                      ? '<td class="disable"> 停用</td> '
                      : '<td class="enable"> 启用</td>'
                  }
                  <td> <a class="btn">编辑</a> <a class="btn"  data-user='` +
            JSON.stringify(data[i]) +
            `'onclick="handleEnable(this)">启/停用</a></td> <!--这里 拼接 单引号，避免浏览器自动加双引号出问题-->
                </tr>
                `;
        }
        tpl += "</tbody>";
        table.removeChild(tableContent);
        table.innerHTML = tpl;
      }
    },
    error: function (err) {
      console.log(err);
    },
  });
}
```

修正

```js
function handleRefresh() {
  // dom更新
  request({
    url: "/session/view/users/data",
    method: "GET",
    data: {},
    success: function (res) {
      if (res) {
        const tableContent = document.getElementById("tableContent");
        const table = document.getElementById("table");
        let tpl = `<tbody id="tableContent">
            <thead>
              <tr>
                <th>lastName</th>
                <th>firstName</th>
                <th>email</th>
                <th>更新时间</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>`;
        const data = res.data;
        for (let i = 0; i < (data || []).length; i++) {
          tpl +=
            `
                <tr>
                  <td>${data[i].lastName ? data[i].lastName : "---"}</td>
                  <td>${data[i].firstName ? data[i].firstName : "---"}</td>
                  <td>${data[i].email}</td>
                  <td>${data[i].updatedAt}</td>
                  ${
                    data[i].destroyTime
                      ? '<td class="disable"> 停用</td> '
                      : '<td class="enable"> 启用</td>'
                  }
                  <td> <a class="btn">编辑</a> <a class="btn" data-user=` +
            JSON.stringify(data[i]) +
            `  onclick="handleEnable(this)">启/停用</a></td>  <!--这里-->
                </tr>
                `;
        }
        tpl += "</tbody>";
        table.removeChild(tableContent);
        table.innerHTML = tpl;
      }
    },
    error: function (err) {
      console.log(err);
    },
  });
}
```
### 扫码登录
- 获取用户ip
[参考文章](http://wmm66.com/index/article/detail/id/177.html)