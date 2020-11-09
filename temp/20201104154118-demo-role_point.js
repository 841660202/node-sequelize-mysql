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

    await queryInterface.bulkInsert('role_points', [
      {
        roleId: 1,
        pointId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 1,
        pointId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 1,
        pointId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 1,
        pointId: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 2,
        pointId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 2,
        pointId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 2,
        pointId: 3,
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
    await queryInterface.bulkDelete('role_points', null, {});
  }
};
