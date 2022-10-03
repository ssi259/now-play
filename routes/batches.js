const batch_controller = require("../controllers/batches_controller.js")
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/search', batch_controller.search_batch);

module.exports = router;