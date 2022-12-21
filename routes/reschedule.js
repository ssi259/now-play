const reschedule_controller = require('../controllers/reschedule_controller')
const express = require('express')
const router = express.Router(); 
const {auth} = require('../middlewares/authentication')


router.post('/' , auth , reschedule_controller.rescheduling);
module.exports = router;