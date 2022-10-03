'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Notifications', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      otp: {
        type: Sequelize.STRING
      },
      expirationDate: {
        type: Sequelize.DATE
      },
      isOtpVerified: {
        type: Sequelize.BOOLEAN
      },
      phoneNumber: {
        type: Sequelize.STRING
      },
      userId: {
        type: Sequelize.INTEGER
      },
      channelType: {
        type: Sequelize.STRING
      },
      notificationType: {
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
    await queryInterface.dropTable('Notifications');
  }
};