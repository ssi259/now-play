var express = require('express');
var user_controller = require('../controllers/users_controller')
const {auth} = require('../middlewares/authentication')

var router = express.Router();

router.get('/upcoming-classes', auth, user_controller.get_upcoming_classes)
router.put('/profile-upload', auth, user_controller.upload_profile_pic)
router.get('/', auth , user_controller.get_user)
router.put('/', auth , user_controller.update_user)

module.exports = router;
