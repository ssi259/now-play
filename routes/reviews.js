const review_controller = require("../controllers/reviews_controller.js")
var express = require('express');
var router = express.Router();
const {auth} = require('../middlewares/authentication')

/* GET users listing. */
router.post('/',auth, review_controller.create_review);
router.get('/eligible',auth, review_controller.check_eligibility);
router.get('/user', auth, review_controller.get_user_reviews);
module.exports = router;

