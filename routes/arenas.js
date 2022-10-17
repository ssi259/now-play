const arena_controller = require("../controllers/arenas_controller.js")
var express = require('express');
const { Sequelize, DataTypes } = require("sequelize");
var router = express.Router();

/* GET users listing. */
router.post('/', arena_controller.create_arena);
module.exports = router;

