'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
      queryInterface.addColumn(
        'Users',
        'gender',
        {
          type:Sequelize.STRING
        }
      ),
      queryInterface.addColumn(
        'Users',
        'type',
        {
          type:Sequelize.STRING
        }
      ),
      queryInterface.addColumn(
        'Users',
        'status',
        {
          type:Sequelize.STRING
        }
      ),
      queryInterface.removeColumn(
        'Users',
        'isVerified'
      );  
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn(
      'Users',
      'gender',
    ),
    queryInterface.removeColumn(
      'Users',
      'type'
    ),
    queryInterface.removeColumn(
      'Users',
      'status'
    ),
    queryInterface.addColumn(
      'Users',
      'isVerified',
      {
        type:Sequelize.BOOLEAN
      }
    ); 
  }
};
