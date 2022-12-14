const reschedule_controller = require("../controllers/reschedule_controller.js")
var express = require('express');
var router = express.Router();
const {auth} = require('../middlewares/authentication.js')

router.post('/',auth,reschedule_controller.rescheduling);
router.get('/',reschedule_controller.getRescheduled);


module.exports = router;