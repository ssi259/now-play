const sport_controller = require("../controllers/sports_controller.js")
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/', sport_controller.create_sport);
module.exports = router;
