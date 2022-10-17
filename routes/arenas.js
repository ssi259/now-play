const arena_controller = require("../controllers/arenas_controller.js")
var express = require('express');
const { Sequelize, DataTypes } = require("sequelize");
var router = express.Router();
const multer = require('multer');


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
       cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
       cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
 });

 var upload = multer({ storage: storage });


/* GET users listing. */
router.post('/', arena_controller.create_arena);
router.post('/image/upload', upload.single('dataFile'),arena_controller.arena_image_upload);

module.exports = router;

