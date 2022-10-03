'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Coach extends Model {
    static associate(models) {
    }
  }
  Coach.init({
    name: DataTypes.STRING,
    contactNumber: DataTypes.STRING,
    email: DataTypes.STRING,
    address: DataTypes.STRING,
    status: DataTypes.STRING,
    sportsName: DataTypes.STRING,
    experience: DataTypes.STRING,
    verified: DataTypes.BOOLEAN,
    tier: DataTypes.STRING,
    awards: DataTypes.STRING,
    teamAffiliations: DataTypes.STRING,
    about: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Coach',
  });
  return Coach;
};