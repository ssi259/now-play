const reschedule_controller = require("../controllers/reschedule_controller.js")
var express = require('express');
var router = express.Router();
const {auth} = require('../middlewares/authentication.js')

<<<<<<< HEAD
router.post('/',auth,reschedule_controller.rescheduling);
=======
router.post('/',auth,reschedule_controller.reschedule_class);
>>>>>>> 2ef35be (Implemeted reschedule class)


module.exports = router;