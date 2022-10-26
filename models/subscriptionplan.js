'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SubscriptionPlan extends Model {
    static associate(models) {
    }
  }
  SubscriptionPlan.init({
    batchId: DataTypes.INTEGER,
    plan_name: DataTypes.STRING,
    description: DataTypes.STRING,
    status: DataTypes.STRING,
    price: DataTypes.INTEGER,
    tag: DataTypes.STRING,
    type: DataTypes.STRING,
    duration: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'SubscriptionPlan',
  });
  return SubscriptionPlan;
};