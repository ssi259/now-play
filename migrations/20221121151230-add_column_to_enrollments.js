'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn(
      'Enrollments',
      'end_date',
      {
        type:Sequelize.DATE
      }
    ),queryInterface.addColumn(
      'Enrollments',
      'type',
      {
        type:Sequelize.STRING
      }
    ),queryInterface.addColumn(
      'Enrollments' ,
      'coach_id',
      {
        type:Sequelize.INTEGER
      }
    )

    
  },

  async down (queryInterface, Sequelize) {
  }
};
