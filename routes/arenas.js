const arena_controller = require("../controllers/arenas_controller.js")
var express = require('express');
var router = express.Router();


/* GET users listing. */
router.post('/', arena_controller.create_arena);
router.post('/upload_files',arena_controller.uploadArenaFiles);

module.exports = router;

