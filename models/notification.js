'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
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