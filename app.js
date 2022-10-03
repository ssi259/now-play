import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import otpRoutes from './routes/otp'
import coachRoutes from './routes/coach'

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
app.use('/coach',coachRoutes)
module.exports = app;
