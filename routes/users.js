var express = require('express');
var user_controller = require('../controllers/users_controller')

var router = express.Router();


router.get('/:id',user_controller.get_user_by_id)

module.exports = router;
