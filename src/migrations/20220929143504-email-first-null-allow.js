'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.changeColumn('Users', 'email', {
        type:Sequelize.STRING,  
        allowNull:true
      }),
      queryInterface.changeColumn('Users', 'firstName', {
        type:Sequelize.STRING, 
        allowNull:true
      })
   ])
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.changeColumn('Users', 'email', {
       type:Sequelize.STRING, 
       allowNull:false
      }),
      queryInterface.changeColumn('Users', 'firstName', {
        type:Sequelize.STRING, 
        allowNull:false
      })
   ])
  }
};
