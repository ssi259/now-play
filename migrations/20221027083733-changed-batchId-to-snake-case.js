'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.renameColumn('SubscriptionPlans','batchId','batch_id')
  },

  async down (queryInterface, Sequelize) {
    queryInterface.renameColumn('SubscriptionPlans','batch_id','batchId')
  }
};
