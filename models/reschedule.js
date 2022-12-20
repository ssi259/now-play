'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reschedule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Reschedule.init({
    batch_id: DataTypes.INTEGER,
    previous_end_time: DataTypes.TIME,
    previous_start_time: DataTypes.TIME,
    updated_start_time: DataTypes.TIME,
    updated_end_time: DataTypes.TIME,
    previous_start_date: DataTypes.DATE,
    updated_start_date: DataTypes.DATE,
    days: DataTypes.JSON,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Reschedule',
  });
  return Reschedule;
};