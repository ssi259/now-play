'use strict';
const {
  Model
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
    arena_id: DataTypes.INTEGER,
    coach_id: DataTypes.INTEGER,
    academy_id: DataTypes.INTEGER,
    sports_id: DataTypes.INTEGER,
    days: DataTypes.JSON,
    price: DataTypes.INTEGER,
    status: {
      type: DataTypes.STRING,
      defaultValue: 'active'
    },
    thumbnail_img: DataTypes.STRING,
    banner_img: DataTypes.STRING,
    start_time: DataTypes.TIME,
    end_time: DataTypes.TIME,
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Batch',
  });
  return Batch;
};