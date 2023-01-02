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
    phone_number: DataTypes.INTEGER,
    email: DataTypes.STRING,
    status: {
      type: DataTypes.STRING,
      defaultValue: "active"
    },
    sports_id: DataTypes.INTEGER,
    experience: DataTypes.INTEGER,
    verified: DataTypes.TINYINT,
    tier: DataTypes.INTEGER,
    awards: DataTypes.JSON,
    team_affiliations: DataTypes.JSON,
    about: DataTypes.STRING,
    profile_pic: DataTypes.STRING,
    locality: DataTypes.STRING,
    city: DataTypes.STRING,
    pincode: DataTypes.INTEGER,
    state: DataTypes.STRING,
    fcm_token:DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Coach',
  });
  return Coach;
};