'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Arena extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Arena.init({
    name: DataTypes.STRING,
    phone_number: DataTypes.INTEGER,
    email: DataTypes.STRING,
    address_id: DataTypes.INTEGER,
    lat: DataTypes.DECIMAL,
    lng: DataTypes.DECIMAL,
    landmark: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Arena',
  });
  return Arena;
};