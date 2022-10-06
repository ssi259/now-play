'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Academy extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Academy.init({
    academy_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    phone_number: DataTypes.INTEGER,
    email: DataTypes.STRING,
    sports: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Academy',
  });
  return Academy;
};