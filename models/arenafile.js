'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ArenaFile extends Model {
    static associate(models) {
    }
  }
  ArenaFile.init({
    arenaId: DataTypes.INTEGER,
    file_url: DataTypes.STRING,
    type: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ArenaFile',
  });
  return ArenaFile;
};