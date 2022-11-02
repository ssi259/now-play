const otp_controller = require('../controllers/otp_controller');
const express = require('express');

const routes = express.Router();

routes.post('/generate', otp_controller.generate);
routes.post('/verify', otp_controller.verify);

module.exports = routes;
