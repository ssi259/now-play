'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AcademyImage extends Model {
    static associate(models) {
    }
  }
  AcademyImage.init({
    academyId: DataTypes.INTEGER,
    img_url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'AcademyImage',
  });
  return AcademyImage;
};