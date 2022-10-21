'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn(
      'CoachDocuments',
      'is_verified',
      {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      }
    )
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn(
      'CoachDocuments',
      'is_verified'
    )
  }
};
