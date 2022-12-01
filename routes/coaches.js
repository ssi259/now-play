const express = require('express');
const coach_controller = require('../controllers/coaches_controller');
const routes = express.Router();
const { auth } = require('../middlewares/authentication')

routes.post('/', coach_controller.createCoach);
routes.post('/upload_images',coach_controller.uploadCoachImages);
routes.post('/upload_documents',coach_controller.uploadCoachDocuments);
routes.get('/', coach_controller.getCoaches)
routes.get('/batches',auth,coach_controller.getCoachBatches)
routes.get('/enrollment/count',auth,coach_controller.getCoachEnrolledStudents)
routes.put('/profile_pic', auth, coach_controller.update_profile_pic)
routes.get('/:id',coach_controller.getCoachById)
routes.get('/earnings/:month&:year',auth,coach_controller.getCoachEarnings)
routes.put('/:id', coach_controller.update_coach_by_id)
module.exports = routes;