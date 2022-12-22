const express = require('express');
const coach_controller = require('../controllers/coaches_controller');
const routes = express.Router();
const { auth } = require('../middlewares/authentication')

routes.get('/classes/upcoming', auth, coach_controller.get_upcoming_classes)
routes.get('/earnings', auth , coach_controller.get_coach_earnings)
routes.get('/details',auth, coach_controller.get_coach_details)
routes.get('/payments', auth, coach_controller.get_payments_by_status)
routes.get('/payments/monthly', auth, coach_controller.get_payments_monthly)
routes.post('/', coach_controller.createCoach);
routes.post('/upload_images',coach_controller.uploadCoachImages);
routes.post('/upload_documents',coach_controller.uploadCoachDocuments);
routes.get('/', coach_controller.getCoaches)
routes.get('/batches/:id',auth,coach_controller.get_batch_details)
routes.get('/batches', auth, coach_controller.getCoachBatches)
routes.get('/enrollment/count', auth, coach_controller.getCoachEnrolledStudents)
routes.get('/enrollment/users',auth, coach_controller.get_enrolled_users_list)
routes.get('/:id', coach_controller.getCoachById)
routes.put('/profile_pic', auth, coach_controller.update_profile_pic)
routes.put('/:id', coach_controller.update_coach_by_id)

module.exports = routes;