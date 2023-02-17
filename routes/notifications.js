const express = require('express')
const notifications_controller = require('../controllers/notifications_controller')
const {auth} = require('../middlewares/authentication')

var router = express.Router();

router.get('/', auth, notifications_controller.get_notifications)
router.put('/', auth, notifications_controller.update_notifications)
router.post('/', notifications_controller.send_notifications)

module.exports = router