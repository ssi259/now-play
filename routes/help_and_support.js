const express = require('express')
const help_and_support_controller = require('../controllers/help_and_support_controller.js')

const router = express.Router()

router.get('/', help_and_support_controller.get_help_and_support)

module.exports = router


