'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Coaches', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      phone_number: {
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING
      },
      city: {
        type: Sequelize.STRING
      },
      state: {
        type: Sequelize.STRING
      },
      pincode: {
        type: Sequelize.INTEGER
      },
      country: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      },
      sports_id: {
        type: Sequelize.INTEGER
      },
      experience: {
        type: Sequelize.STRING
      },
      verified: {
        type: Sequelize.TINYINT
      },
      tier: {
        type: Sequelize.INTEGER
      },
      awards: {
        type: Sequelize.STRING
      },
      team_affiliations: {
        type: Sequelize.STRING
      },
      about: {
        type: Sequelize.STRING
      },
      review_id: {
        type: Sequelize.STRING
      },
      profile_pic: {
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
    await queryInterface.dropTable('Coaches');
  }
};