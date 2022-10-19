'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ArenaImage extends Model {
    static associate(models) {
    }
  }
  ArenaImage.init({
    arenaId: DataTypes.INTEGER,
    img_url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ArenaImage',
  });
  return ArenaImage;
};