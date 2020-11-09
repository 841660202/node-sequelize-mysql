'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Point extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Point.belongsTo(models.Role, {
      //   onDelete: "NULL",
      //   foreignKey: { // 定义指定的列为外键
      //     name: 'roleId',
      //     allowNull: false
      //   },
      //   as: 'roles' // 定义获取到的结果别名 roles,如果不改 获取到的是 {Role:{}}
      // })

      Point.belongsToMany(models.Role, {through: models.RolePoint, foreignKey: 'pointId', as: 'roles' })
    }
  };
  Point.init({
    pointName: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Point',
  });
  return Point;
};