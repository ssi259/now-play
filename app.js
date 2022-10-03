import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import otpRoutes from './src/routes/otp'

dotenv.config();
require('./config/sequelize');

const app = express();
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
app.use(cors());
app.use(bodyParser.json());
app.use('/notifications/otp', otpRoutes);
module.exports = app;
