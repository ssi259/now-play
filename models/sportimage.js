'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SportImage extends Model {
    static associate(models) {
    }
  }
  SportImage.init({
    sportId: DataTypes.INTEGER,
    img_url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'SportImage',
  });
  return SportImage;
};