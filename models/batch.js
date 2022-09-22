const { Sequelize, DataTypes } = require("sequelize")
const sequelize = require("../config/sequelize")
const Batch  = sequelize.define("Batches",{
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  sports: {
    type: Sequelize.STRING
  },
  coach: {
    type: Sequelize.STRING
  },
  lat: {
    type: Sequelize.DECIMAL
  },
  lng: {
    type: Sequelize.DECIMAL
  },
  createdAt: {
    allowNull: false,
    type: Sequelize.DATE
  },
  updatedAt: {
    allowNull: false,
    type: Sequelize.DATE
  }
});

module.exports = {Batch}