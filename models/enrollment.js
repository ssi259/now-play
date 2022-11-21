'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Enrollment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Enrollment.init({
    batch_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    subscription_id: DataTypes.INTEGER,
    status: DataTypes.STRING,
    end_date:DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Enrollment',
  });
  return Enrollment;
};