'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
    }
  }
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    profilePic: DataTypes.STRING,
    verifyToken: DataTypes.STRING,
    isVerified: DataTypes.BOOLEAN,
    phoneNumber: DataTypes.STRING,
    isPhoneVerified: DataTypes.BOOLEAN,
    isEmailVerified: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};