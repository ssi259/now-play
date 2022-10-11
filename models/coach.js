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
    contact_number: DataTypes.INTEGER,
    email: DataTypes.STRING,
    address: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    pincode: DataTypes.INTEGER,
    country: DataTypes.STRING,
    status: DataTypes.STRING,
    sports_id: DataTypes.INTEGER,
    experience: DataTypes.STRING,
    verified: DataTypes.STRING,
    tier: DataTypes.INTEGER,
    awards: DataTypes.STRING,
    team_affiliations: DataTypes.STRING,
    about: DataTypes.STRING,
    review: DataTypes.STRING,
    profile_pic: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Coach',
  });
  return Coach;
};