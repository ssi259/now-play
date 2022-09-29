'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'Users',
        'phoneNumber',
        {
          type: Sequelize.STRING
        }
      ),
      queryInterface.addColumn(
        'Users',
        'isMobileVerified',
        {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        }
      ),
      queryInterface.addColumn(
        'Users',
        'isEmailVerified',
        {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        }
      ),
    ]);
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('Users', 'phoneNumber'),
      queryInterface.removeColumn('Users', 'isMobileVerified'),
      queryInterface.removeColumn('Users', 'isEmailVerified')
    ])
  },
};
