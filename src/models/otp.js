'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Otp extends Model {
    static associate(models) {
    }
  }
  Otp.init({
    otp: DataTypes.STRING,
    expiration_time: DataTypes.DATE,
    verified: DataTypes.BOOLEAN,
    phone_number: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Otp',
  });
  return Otp;
};