const sport_controller = require("../controllers/sports_controller.js")
var express = require('express');
const { Sequelize, DataTypes } = require("sequelize");
var router = express.Router();

/* GET users listing. */
router.post('/', sport_controller.create_sport);
router.get('/',sport_controller.sports_list);
module.exports = router;

