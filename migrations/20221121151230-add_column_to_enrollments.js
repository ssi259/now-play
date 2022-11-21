'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn(
      'Enrollments',
      'end_date',
      {
        type:Sequelize.DATE
      }
    )
    
  },

  async down (queryInterface, Sequelize) {
  }
};
