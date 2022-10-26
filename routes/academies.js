const academy_controller = require("../controllers/academies_controller.js")
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/', academy_controller.create_academy);
router.post('/upload_images',academy_controller.uploadAcademyImages);
router.get('/:id',academy_controller.academy_details);


module.exports = router;