const batch_controller = require("../controllers/batches_controller.js")
var express = require('express');
const { Sequelize, DataTypes } = require("sequelize");
var router = express.Router();

/* GET users listing. */
router.get('/search', batch_controller.search_batch);
router.post('/', batch_controller.create_batch);
router.get('/:id',batch_controller.batch_details);
module.exports = router;

