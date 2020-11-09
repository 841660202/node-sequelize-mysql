'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('users', "destroyTime", { // name of the key we're adding 
      type: Sequelize.DATE,
      allowNull: true, // 如果数据库有数据，此处再写allowNull:false ERROR: Incorrect datetime value: '0000-00-00 00:00:00' for column 'destroyTime' at row 1
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('users', "destroyTime");
  }
};
