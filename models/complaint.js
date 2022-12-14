'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Complaint extends Model {
    static associate(models) {
    }
  }
  Complaint.init({
    complainant_id: DataTypes.INTEGER,
    complainant_type: DataTypes.STRING,
    subject: DataTypes.TEXT,
    text: DataTypes.TEXT,
    is_call_request: DataTypes.BOOLEAN,
    status: {
      type: DataTypes.STRING,
      defaultValue: 'open' // open, closed, in_progress
    }
  }, {
    sequelize,
    modelName: 'Complaint',
  });
  return Complaint;
};