const express = require('express')
const notifications_controller = require('../controllers/notifications_controller')
const {auth} = require('../middlewares/authentication')

var router = express.Router();

router.get('/', auth, notifications_controller.get_notifications)

module.exports = router