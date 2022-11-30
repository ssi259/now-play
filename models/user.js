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
    phoneNumber: DataTypes.STRING,
    isPhoneVerified: DataTypes.BOOLEAN,
    isEmailVerified: DataTypes.BOOLEAN,
    gender:DataTypes.STRING,
    type:DataTypes.STRING,
    status: {
      type: DataTypes.STRING,
      defaultValue: 'active'
    },
    dob:DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};