const review_controller = require("../controllers/reviews_controller.js")
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/', review_controller.create_review);
module.exports = router;

