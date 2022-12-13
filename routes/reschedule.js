const express = require('express')
const reschedule_controller = require('../controllers/reschedule_controller')
const {auth} = require('../middlewares/authentication')

const router = express.Router();

router.post('/' , auth , reschedule_controller.rescheduling)