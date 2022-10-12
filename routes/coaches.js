const express = require('express');
const coachController = require('../controllers/coaches_controller');

const routes = express.Router();

routes.post('/', coachController.createCoach);

module.exports = routes;