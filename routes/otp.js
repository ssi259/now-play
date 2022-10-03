import * as otpController from '../controllers/otp/otp.controller';

const express = require('express');
const router = express.Router();

router.post('/generate', otpController.generateOtp);
router.post('/verify', otpController.verifyOtp);

module.exports = router;
