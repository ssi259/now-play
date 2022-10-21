const sport_controller = require("../controllers/sports_controller.js")
var express = require('express');
var router = express.Router();

router.post('/', sport_controller.create_sport);
router.get('/', sport_controller.sports_list);
router.post('/upload_images',sport_controller.uploadSportImages);
router.get('/:id',sport_controller.sport_list);
module.exports = router;

