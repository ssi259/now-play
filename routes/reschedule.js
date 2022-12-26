const reschedule_controller = require("../controllers/reschedule_controller.js")
var express = require('express');
var router = express.Router();
const {auth} = require('../middlewares/authentication.js')

<<<<<<< HEAD
<<<<<<< HEAD
router.post('/',auth,reschedule_controller.rescheduling);
=======
router.post('/',auth,reschedule_controller.reschedule_class);
>>>>>>> 2ef35be (Implemeted reschedule class)
=======
router.post('/',auth,reschedule_controller.rescheduling);
>>>>>>> 34570f1 (change of name in controller and manager)


module.exports = router;