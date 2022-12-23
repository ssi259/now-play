'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reschedule_class extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Reschedule_class.init({
    batch_id: DataTypes.INTEGER,
    reschedule_date: DataTypes.DATE,
    reschedule_start_time: DataTypes.TIME,
    reschedule_end_time: DataTypes.TIME,
    type: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Reschedule_class',
  });
  return Reschedule_class;
};