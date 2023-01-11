'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) { 
    await queryInterface.removeColumn('Notifications', 'otp');
    await queryInterface.removeColumn('Notifications', 'expirationDate');
    await queryInterface.removeColumn('Notifications', 'isVerified');
    await queryInterface.removeColumn('Notifications', 'phoneNumber');
    await queryInterface.removeColumn('Notifications', 'userId');
    await queryInterface.removeColumn('Notifications', 'channelType');
    await queryInterface.removeColumn('Notifications', 'NotificationType');
    await queryInterface.addColumn('Notifications', 'sender_id',
      {
      type:Sequelize.INTEGER
      }
    );
    await queryInterface.addColumn('Notifications', 'sender_type',
      {
      type:Sequelize.STRING
      }
    );
    await queryInterface.addColumn('Notifications', 'receiver_id',
      {
      type:Sequelize.INTEGER
      }
    );
    await queryInterface.addColumn('Notifications', 'receiver_type',
      {
      type:Sequelize.STRING
      }
    );
    await queryInterface.addColumn('Notifications', 'type',
      {
      type:Sequelize.STRING
      }
    );
    await queryInterface.addColumn('Notifications', 'title',
      {
      type:Sequelize.TEXT
      }
    );
    await queryInterface.addColumn('Notifications', 'body',
      {
      type:Sequelize.TEXT
      }
    );
    await queryInterface.addColumn('Notifications', 'data',
      {
      type:Sequelize.JSON
      }
    );
    await queryInterface.addColumn('Notifications', 'is_marketing',
      {
      type:Sequelize.BOOLEAN
      }
    );
    await queryInterface.addColumn('Notifications', 'is_read',
      {
      type:Sequelize.BOOLEAN
      }
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Notifications', 'sender_id');
    await queryInterface.removeColumn('Notifications', 'sender_type');
    await queryInterface.removeColumn('Notifications', 'receiver_id');
    await queryInterface.removeColumn('Notifications', 'receiver_type');
    await queryInterface.removeColumn('Notifications', 'type');
    await queryInterface.removeColumn('Notifications', 'title');
    await queryInterface.removeColumn('Notifications', 'body');
    await queryInterface.removeColumn('Notifications', 'data');
    await queryInterface.removeColumn('Notifications', 'is_marketing');
    await queryInterface.removeColumn('Notifications', 'is_read');
    await queryInterface.addColumn('Notifications', 'otp',
      {
        type: Sequelize.STRING
      }
    );
    await queryInterface.addColumn('Notifications', 'expirationDate',
      {
        type: Sequelize.DATE
      }
    );
    await queryInterface.addColumn('Notifications', 'isVerified',
      {
        type: Sequelize.BOOLEAN
      }
    );
    await queryInterface.addColumn('Notifications', 'phoneNumber',
      {
        type: Sequelize.STRING
      }
    );
    await queryInterface.addColumn('Notifications', 'userId',
      {
        type: Sequelize.INTEGER
      }
    );
    await queryInterface.addColumn('Notifications', 'channelType',
      {
        type: Sequelize.STRING
      }
    );
    await queryInterface.addColumn('Notifications', 'notificationType',
      {
        type: Sequelize.STRING
      }
    );
  }
};
