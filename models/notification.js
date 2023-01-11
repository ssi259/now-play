'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    static associate(models) {
    }
  }
  Notification.init({
    sender_id:DataTypes.INTEGER,
    sender_type: DataTypes.STRING,
    receiver_id:DataTypes.INTEGER,
    receiver_type: DataTypes.STRING,
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