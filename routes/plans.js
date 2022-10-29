const express = require('express')
const plans_controller = require('../controllers/plans_controller')

const router = express.Router();

router.post('/',plans_controller.create)
<<<<<<< HEAD
router.get('/', plans_controller.getPlanByBatchId)   
 
=======
router.put('/:id',plans_controller.update)
    
>>>>>>> update_plan
module.exports = router
