const batch_controller = require("../controllers/batches_controller.js")
var express = require('express');
var router = express.Router();
const {auth} = require('../middlewares/authentication')

router.get('/classes/next', auth, batch_controller.get_next_class)
router.get('/upcoming', auth, batch_controller.get_upcoming_classes)
router.get('/search', batch_controller.search_batch);
router.get('/images', batch_controller.get_batch_images);
router.post('/', batch_controller.create_batch);
router.post('/upload_file', batch_controller.uploadImage);
router.get('/:id',batch_controller.batch_details);
router.put('/:id',batch_controller.update_batch_details);
module.exports = router;