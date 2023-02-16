'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Help_and_Supports', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      start_new_batch: {
        type: Sequelize.STRING
      },
      payment_issues: {
        type: Sequelize.STRING
      },
      update_my_details: {
        type: Sequelize.STRING
      },
      problem_with_existing_batch: {
        type: Sequelize.STRING
      },
      other: {
        type: Sequelize.STRING
      },
      any_new_batch_to_start_in_my_area: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Help_and_Supports');
  }
};