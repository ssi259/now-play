'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CoachImage extends Model {
    static associate(models) {
    }
  }
  CoachImage.init({
    coachId: DataTypes.INTEGER,
    img_url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'CoachImage',
  });
  return CoachImage;
};