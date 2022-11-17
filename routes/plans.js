const express = require('express')
const plans_controller = require('../controllers/plans_controller')
const {auth} = require('../middlewares/authentication')

const router = express.Router();

router.post('/' ,plans_controller.create)
router.get('/',auth , plans_controller.getPlanByBatchId)   
router.put('/:id', plans_controller.update_plan)
router.get('/',plans_controller.plans_details);

    
module.exports = router
