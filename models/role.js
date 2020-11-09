'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Role.hasMany(models.User)
      Role.belongsToMany(models.Point, { through: models.RolePoint, foreignKey: 'roleId', as: 'points' })
    }
  };
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
  });
  return Role;
};