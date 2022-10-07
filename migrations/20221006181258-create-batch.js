'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Batches', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      arena_id: {
        type: Sequelize.INTEGER
      },
      coach_id: {
        type: Sequelize.INTEGER
      },
      academy_id: {
        type: Sequelize.INTEGER
      },
      sports_id: {
        type: Sequelize.INTEGER
      },
      days: {
        type: Sequelize.JSON
      },
      price: {
        type: Sequelize.INTEGER
      },
      thumbnail_img: {
        type: Sequelize.STRING
      },
      start_time: {
        type: Sequelize.TIME
      },
      end_time: {
        type: Sequelize.TIME
      },
      start_date: {
        type: Sequelize.DATE
      },
      end_date:{
        type: Sequelize.DATE
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
    await queryInterface.dropTable('Batches');
  }
};