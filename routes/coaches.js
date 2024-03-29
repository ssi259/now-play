const express = require('express');
const coach_controller = require('../controllers/coaches_controller');
const reschedule_controller = require('../controllers/reschedule_controller');
const routes = express.Router();
const { auth } = require('../middlewares/authentication')

routes.put('/token/fcm', auth, coach_controller.add_fcm_token)
routes.get('/classes/upcoming', auth, coach_controller.get_upcoming_classes)
routes.get('/earnings', auth , coach_controller.get_coach_earnings)
routes.get('/details',auth, coach_controller.get_coach_details)
routes.get('/payments', auth, coach_controller.get_payments_by_status)
routes.get('/attendance', auth, coach_controller.get_attendance)
routes.get('/payments/monthly', auth, coach_controller.get_payments_monthly)
routes.post('/', coach_controller.createCoach);
routes.post('/reminders/payment', auth, coach_controller.send_payment_reminder);
routes.post('/upload_images',coach_controller.uploadCoachImages);
routes.post('/upload_documents',coach_controller.uploadCoachDocuments);
routes.get('/', coach_controller.get_coaches)
routes.get('/plans/:id', auth, coach_controller.get_batch_subscription_details_of_coach)
routes.get('/batches/:id',auth,coach_controller.get_batch_details)
routes.get('/player/:id',auth,coach_controller.get_player_details)
routes.get('/batches', auth, coach_controller.getCoachBatches)
routes.get('/enrollment/count', auth, coach_controller.getCoachEnrolledStudents)
routes.get('/enrollment/users',auth, coach_controller.get_enrolled_users_list)
routes.get('/:id', coach_controller.getCoachById)
routes.put('/profile_pic', auth, coach_controller.update_profile_pic)
routes.put('/:id', coach_controller.update_coach_by_id)
routes.post('/reschedule', auth, reschedule_controller.rescheduling)
routes.get('/get/reschedule', reschedule_controller.getRescheduled)
module.exports = routes;