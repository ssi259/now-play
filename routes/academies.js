const academy_controller = require("../controllers/academies_controller.js")
var express = require('express');
const { Sequelize, DataTypes } = require("sequelize");
var router = express.Router();

/* GET users listing. */
router.post('/', academy_controller.create_academy);
module.exports = router;