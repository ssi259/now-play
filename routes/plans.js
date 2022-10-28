const express = require('express')
const plans_controller = require('../controllers/plans_controller')

const router = express.Router();

router.post('/',plans_controller.create)
    
module.exports = router
