const otpController = require('../controllers/notification_otp_controller');
const express = require('express');

const routes = express.Router();

routes.post('/generate', otpController.generateOtp);
routes.post('/verify', otpController.verifyOtp);

module.exports = routes;
