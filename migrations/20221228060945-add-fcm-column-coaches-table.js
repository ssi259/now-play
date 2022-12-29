'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'Coaches',
      'fcm_token',
      {
        type: Sequelize.STRING,
        allowNull: true
      }
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      'Coaches',
      'fcm_token'
    );
  }
};
