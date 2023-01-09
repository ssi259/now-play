const payment_controller = require("../controllers/payments_controller.js")
var express = require('express');
var router = express.Router();
const {auth} = require('../middlewares/authentication')

router.get('/entries', payment_controller.all_payments);
router.post('/', auth, payment_controller.create_payment);
router.put('/', auth, payment_controller.update_payment);
router.get('/', auth ,payment_controller.transaction_details);
router.get('/count', auth, payment_controller._get_count_of_payments);

module.exports = router;
