'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn(
      'Payments',
      'coach_id',
      {
        type:Sequelize.INTEGER
      }
    )
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
