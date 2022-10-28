require('dotenv').config();
const jwt = require('jsonwebtoken')
const { User, Notification } = require('../models'); 
const AWS = require('aws-sdk');
const { Op } = require("sequelize");
const Api400Error = require('../error/api400Error')
const Api500Error = require('../error/api500Error')


AWS.config.loadFromPath(__dirname +'/../config/aws_config.json');
AWS.config.update({ region: 'ap-southeast-1' });

exports.pre_process_generate = async (req) => {
    const { phone_number } = req.body;
    if (!phone_number) {
        throw new Api400Error("phone number not provided")
    }
    return req.body
}

exports.process_generate = async (input) => {
    const { phone_number } = input
    const now = new Date();
    let otp;
    const expiration_date = new Date(now.getTime() + 10 * 60000);
    const otp_instance = await Notification.findOne({
        where: {
            phoneNumber: phone_number,
            notificationType: "otp",
            isVerified:false,
            expirationDate: {
                [Op.gt]:now
            }
        }
    });
    if (!otp_instance) {
        otp = otp_generator();
        await Notification.create({
            otp:otp,
            expirationDate:expiration_date,
            phoneNumber:phone_number,
            isVerified: false,
            channelType: "sms",
            notificationType: "otp"
        })
    }
    else {
        otp=otp_instance.otp
    }
    return {phone_number, otp}
}

exports.post_process_generate = async (input, resp) => {
    const {phone_number , otp} = input
    const phone_message =
        `Dear User,\n`
        + `${otp} is your OTP for Phone Number Verfication. Please enter the OTP to verify your phone number`
    const params = {
        Message: phone_message,
        PhoneNumber:`+91${phone_number}`
    }
    const publishTextPromise = new AWS.SNS({ apiVersion: '2010-03-31' }).publish(params).promise();
    publishTextPromise.then((data) => {
        resp.status(200).send({status:"success",message:"otp sent successfully"})
    }).catch((err) => {
        throw new Api500Error('error while sending otp')
    })
}

exports.pre_process_verify = async (req) => {
    const { phone_number, otp } = req.body;
    if (!phone_number) {
        throw new Api400Error("phone number not provided")
    }
    if (!otp) {
        throw new Api400Error("otp not provided")
    }
    return req.body
}

exports.process_verify = async (input) => {
    const { phone_number, otp } = input 
    const currentDate = new Date();
    const otp_instance = await Notification.findOne({
        where:
        {
            otp: otp,
            phoneNumber: phone_number,
            notificationType: "otp",
        }
    });
    if (!otp_instance) {
        throw new Api400Error("otp not matched")
    }
    if (otp_instance.expirationDate < currentDate) {
        throw new Api400Error("otp exprired")
    }
    if (otp_instance.isVerified) {
        throw new Api400Error("otp already used")
    }
    otp_instance.isVerified = true
    await otp_instance.save();
    const user = await User.findOne({
        where:{
        phoneNumber:phone_number,
        }
    });
    if (user != null) {
        return user.verifyToken
    }
    const new_user = await User.create({
        phoneNumber: phone_number,
        isPhoneVerified: true,
    })
    const token = jwt.sign(
        {
            userId: new_user.id
        },
        process.env.JWT_SECRET_KEY,
    );
    return token
}

exports.post_process_verify = async (token,resp) => {
    resp.status(200).send({ status: "success", message:"otp matched", data: {jwt_token:token} }); 
}

function otp_generator() {
    var digits = '0123456789';
    let otp = '';
    for (let i = 0; i < 4; i++ ) {
        otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
}