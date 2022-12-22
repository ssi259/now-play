'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class fcm_token extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  fcm_token.init({
    user_id: DataTypes.INTEGER,
    fcm_token: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'fcm_token',
  });
  return fcm_token;
};