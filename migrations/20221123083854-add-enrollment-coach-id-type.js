'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn(
      'Enrollments',
      'type',
      {
        type: Sequelize.STRING
      }
    ),
      queryInterface.addColumn(
        'Enrollments',
        'coach_id',
        {
          type:Sequelize.INTEGER
        }
    )
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn(
      'Enrollments',
      'type'
    ),
      queryInterface.removeColumn(
        'Enrollments',
        'coach_id'
    )
  }
};
