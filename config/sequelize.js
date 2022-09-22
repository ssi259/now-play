const { Sequelize,DataTypes } = require("sequelize")
//todo: get db params from config.js as per environment
const sequelize =   new Sequelize("now_play", "root", "root", {
    dialect: "mysql"});

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
    }).catch((error) => {
    console.error('Unable to connect to the database: ', error);
    });

module.exports = sequelize