var express = require('express');
var user_controller = require('../controllers/users_controller')
const {auth} = require('../middlewares/authentication')

var router = express.Router();


router.get('/:id',auth , user_controller.get_user_by_id)
router.put('/:id',auth , user_controller.update_user_by_id)
router.get('/enrollments/:id', auth, user_controller.get_user_enrollments)
module.exports = router;
