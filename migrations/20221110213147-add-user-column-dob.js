'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn(
      'Users',
      'dob',
      {
        type:Sequelize.STRING
      }
    )
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn(
      'Users',
      'dob'
    )
  }
};
