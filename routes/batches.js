const batch_controller = require("../controllers/batches_controller.js")
var express = require('express');
var router = express.Router();
router.get('/search', batch_controller.search_batch);
router.post('/', batch_controller.create_batch);
module.exports = router;
