'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Coach extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Coach.init({
    name: DataTypes.STRING,
    sports_id: DataTypes.INTEGER,
    experience: DataTypes.STRING,
    rating: DataTypes.INTEGER,
    rating_count: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Coach',
  });
  return Coach;
};