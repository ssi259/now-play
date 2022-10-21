'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CoachDocument extends Model {
    static associate(models) {
    }
  }
  CoachDocument.init({
    coachId: DataTypes.INTEGER,
    document_url: DataTypes.STRING,
    document_type: DataTypes.STRING,
    is_verified: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'CoachDocument',
  });
  return CoachDocument;
};