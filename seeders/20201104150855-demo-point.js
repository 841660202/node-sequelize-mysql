'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    return queryInterface.bulkInsert('points', [
      {
        pointName: '人员管理',
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        pointName: '角色管理',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pointName: '项目管理',
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        pointName: '任务管理',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('points', null, {});
  }
};
