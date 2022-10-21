const express = require('express');
const coach_controller = require('../controllers/coaches_controller');

const routes = express.Router();

routes.post('/', coach_controller.createCoach);
routes.post('/upload_images',coach_controller.uploadCoachImages);

module.exports = routes;