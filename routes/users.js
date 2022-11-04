var express = require('express');
var user_controller = require('../controllers/users_controller')

var router = express.Router();


router.get('/:id',user_controller.get_user_by_id)
router.put('/:id', user_controller.update_user_by_id)
router.get('/:id/upcoming-classes', user_controller.get_upcoming_classes)


module.exports = router;
