const complaint_controller = require('../controllers/complaint_controller')
const {auth} = require('../middlewares/authentication')
var express = require('express');
var router = express.Router();

router.post('/', auth, complaint_controller.create)
router.get('/', complaint_controller.get)
router.put('/:id', complaint_controller.update)

module.exports = router;