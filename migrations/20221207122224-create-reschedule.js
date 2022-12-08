'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Reschedules', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      batch_id: {
        type: Sequelize.INTEGER
      },
      previous_end_time: {
        type: Sequelize.TIME
      },
      previous_start_time: {
        type: Sequelize.TIME
      },
      updated_start_time: {
        type: Sequelize.TIME
      },
      updated_end_time: {
        type: Sequelize.TIME
      },
      previous_start_date: {
        type: Sequelize.DATE
      },
      updated_start_date: {
        type: Sequelize.DATE
      },
      previous_end_date:{
        type: Sequelize.DATE
      },
      updated_end_date:{
        type: Sequelize.DATE
      },
      previous_days: {
        type: Sequelize.JSON
      },
      updated_days: {
        type: Sequelize.JSON
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
    await queryInterface.dropTable('Reschedules');
  }
};