const arena_controller = require("../controllers/arenas_controller.js")
var express = require('express');
var router = express.Router();


router.post('/', arena_controller.create_arena);
router.post('/upload_images',arena_controller.uploadArenaImages);
router.get('/',arena_controller.arena_details);

module.exports = router;