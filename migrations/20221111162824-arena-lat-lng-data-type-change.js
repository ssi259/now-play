'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.changeColumn(
      'Arenas',
      'lat',
      {
        type: Sequelize.FLOAT(10, 4) 
      }
    ),
    queryInterface.changeColumn(
      'Arenas',
      'lng',
      {
        type: Sequelize.FLOAT(10, 4) 
      }
   )
  },

  async down (queryInterface, Sequelize) {
    queryInterface.changeColumn(
      'Arenas',
      'lat',
      {
        type: Sequelize.DECIMAL 
      }
    ),
    queryInterface.changeColumn(
      'Arenas',
      'lng',
      {
        type: Sequelize.DECIMAL
      }
   )
  }
};
