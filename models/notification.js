'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    static associate(models) {
    }
  }
  Notification.init({
    otp: DataTypes.STRING,
    expirationDate: DataTypes.DATE,
    isOtpVerified: DataTypes.BOOLEAN,
    phoneNumber: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    channelType: DataTypes.STRING,
    notificationType: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Notification',
  });
  return Notification;
};