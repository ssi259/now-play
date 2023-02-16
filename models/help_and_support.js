'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Help_and_Support extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Help_and_Support.init({
    start_new_batch: DataTypes.STRING,
    payment_issues: DataTypes.STRING,
    update_my_details: DataTypes.STRING,
    problem_with_existing_batch: DataTypes.STRING,
    other: DataTypes.STRING,
    any_new_batch_to_start_in_my_area: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Help_and_Support',
  });
  return Help_and_Support;
};