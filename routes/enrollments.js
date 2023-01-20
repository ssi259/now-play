const express = require('express')
const enrollment_controller = require('../controllers/enrollments_controller')
const {auth} = require('../middlewares/authentication')

const router = express.Router()

router.get('/', auth, enrollment_controller.get_enrollments)
router.get('/details',enrollment_controller.get_all_enrollments_details)
router.put('/', auth, enrollment_controller.update_user_enrollment)

module.exports = router