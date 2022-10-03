import * as coachController from '../controllers/coach.controller';
const express = require('express');

const routes = express.Router();

routes.post('/register', coachController.registerCoach);
routes.get('/get', coachController.getCoaches);

module.exports = routes;

