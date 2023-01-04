const lead_controller = require('../controllers/leads_controller');
var express = require('express');
var router = express.Router();

router.post('/', lead_controller.create_lead);
router.get('/all', lead_controller.get_leads);

module.exports = router;