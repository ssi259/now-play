const express = require('express');
const coach_controller = require('../controllers/coaches_controller');

const routes = express.Router();

routes.post('/', coach_controller.createCoach);
routes.post('/upload_images',coach_controller.uploadCoachImages);
routes.post('/upload_documents',coach_controller.uploadCoachDocuments);
routes.get('/', coach_controller.getCoaches)
routes.get('/:id',coach_controller.getCoachById)

module.exports = routes;