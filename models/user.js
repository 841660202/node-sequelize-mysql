'use strict';
const dayjs = require('dayjs');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      /**
       * Executing (default): SELECT count(`User`.`id`) AS `count` FROM `Users` AS `User` LEFT OUTER JOIN `Roles` AS `roles` ON `User`.`roleId` = `roles`.`id`;
       * Executing (default): SELECT `User`.`id`, `User`.`firstName`, `User`.`lastName`, `User`.`email`, `roles`.`id` AS `roles.id`, `roles`.`roleName` AS `roles.roleName` FROM `Users` AS `User` LEFT OUTER JOIN `Roles` AS `roles` ON `User`.`roleId` = `roles`.`id` LIMIT 0, 10;
       * GET /user/withRoleAtt - 46ms
       */
      User.belongsTo(models.Role, {
        onDelete: "NULL",
        foreignKey: { // 定义指定的列为外键
          name: 'roleId',
          allowNull: false
        },
        as: 'roles' // 定义获取到的结果别名 roles,如果不改 获取到的是 {Role:{}}
      })
    }
  };
  User.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    createdAt: {
      type: DataTypes.DATE,
      get() {
        return dayjs(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
      }
    },
    updatedAt: {
      type: DataTypes.DATE,
      get() {
        return dayjs(this.getDataValue('updatedAt')).format('YYYY-MM-DD HH:mm:ss');
      }
    }
  }, {
    sequelize,
    modelName: 'User',
    paranoid: true,
    // If you want to give a custom name to the deletedAt column
    deletedAt: 'destroyTime',
    validate: {
      bothCoordsOrNone() {
        console.log(this.roleId, "this.roleId ")
        // if ((this.latitude === null) !== (this.longitude === null)) {
        //   throw new Error('Either both latitude and longitude, or neither!');
        // }
        if (typeof this.roleId !== 'number') {
          throw new Error('新建用户需要绑定角色!');
        }
      }
    }
  });
  return User;
};