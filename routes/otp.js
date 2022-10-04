const otpController = require('../controllers/otp.controller');
const express = require('express');

const routes = express.Router();

routes.post('/generate', otpController.generateOtp);
routes.post('/verify', otpController.verifyOtp);

module.exports = routes;
