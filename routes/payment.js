const payment_controller = require("../controllers/payments_controller.js")
var express = require('express');
var router = express.Router();

router.post('/', payment_controller.create_payment);
module.exports = router;
