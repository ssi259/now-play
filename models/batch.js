'use strict';
const {
  Model, DataTypes
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Batch extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Batch.init({
    id: DataTypes.INTEGER,
    arena_id: DataTypes.INTEGER,
    coach_id: DataTypes.INTEGER,
    sports_id: DataTypes.INTEGER,
    days: DataTypes.STRING,
    price: DataTypes.INTEGER,
    start_time: DataTypes.DATE,
    end_time: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Batch',
  });
  return Batch;
};
