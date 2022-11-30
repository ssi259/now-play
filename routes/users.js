var express = require('express');
var user_controller = require('../controllers/users_controller')
const {auth} = require('../middlewares/authentication')

var router = express.Router();

router.put('/profile-upload', auth, user_controller.upload_profile_pic)
router.get('/all', user_controller.get_all_users)
router.get('/', auth , user_controller.get_user)
router.put('/', user_controller.update_user) // update user on profile page of user
router.put('/:id', user_controller.update_user_on_adminPanel) // update user from admin panel


module.exports = router;
