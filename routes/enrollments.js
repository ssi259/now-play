const express = require('express')
const enrollment_controller = require('../controllers/enrollments_controller')
const {auth} = require('../middlewares/authentication')

const router = express.Router()

router.get('/', auth, enrollment_controller.get_enrollments)

module.exports = router