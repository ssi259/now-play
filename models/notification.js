'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    static associate(models) {
    }
  }
  Notification.init({
    user_id:DataTypes.INTEGER,
    user_type: DataTypes.STRING,
    type: DataTypes.STRING,
    title: DataTypes.TEXT,
    body: DataTypes.TEXT,
    data: DataTypes.JSON,
    is_marketing: DataTypes.BOOLEAN,
    is_read: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Notification',
  });
  return Notification;
};