require('dotenv').config();
const jwt = require('jsonwebtoken')
const { User, Notification } = require('../../models'); 
const AWS = require('aws-sdk');
const { Op } = require("sequelize");

AWS.config.loadFromPath(__dirname +'/../../config/aws_config.json');
AWS.config.update({ region: 'ap-southeast-1' });

exports.generateOtp = async (req, res) => {
    try {
        const { phoneNumber } = req.body;
        if (!phoneNumber) {
            return res.status(400).send({ status: 'failure', message: 'phone number not provided'});
        }
        const now = new Date();
        let otp;
        const expirationDate = new Date(now.getTime() + 10 * 60000);
        const otpInstance = await Notification.findOne({
            where: {
                phoneNumber: phoneNumber,
                notificationType: "otp",
                isVerified:false,
                expirationDate: {
                    [Op.gt]:now
                }
            }
        });
        if (!otpInstance) {
            otp = otpGenerator();
            await Notification.create({
                otp,
                expirationDate,
                phoneNumber,
                isVerified: false,
                channelType: "sms",
                notificationType: "otp"
            })
        }
        else {
            otp=otpInstance.otp
        }
        const phoneMessage =
            `Dear User,\n`
            + `${otp} is your OTP for Phone Number Verfication. Please enter the OTP to verify your phone number`
        const params = {
            Message: phoneMessage,
            PhoneNumber:phoneNumber
        }
        let publishTextPromise = new AWS.SNS({ apiVersion: '2010-03-31' }).publish(params).promise();

        publishTextPromise.then((data) => {
            return res.status(200).send({status:"success",message:"otp sent successfully"})
        }).catch((err) => {
            return res.send({status:"failure",message:err.message})
        })
    }catch (error) {
        return res.status(500).send({ status: "failure", message: error.message });
    }
};

exports.verifyOtp = async (req, res) => {
    try {
        const { phoneNumber, otp } = req.body;
        const currentDate = new Date();
        if (!phoneNumber) {
            return res.status(400).send({ status: "failure", message: "phone number not provided", data:{} })
        }
        if (!otp) {
            return res.status(400).send({ status: "failure", message: "otp not provided", data : {} });
        }
        const otpInstance = await Notification.findOne({
            where:
            {
                otp: otp,
                phoneNumber: phoneNumber,
                notificationType: "otp",
            }
        });
        if (!otpInstance) {
            return res.status(400).send({ status: "failure", message: "otp not matched" , data:{}});
        }
        if (otpInstance.expirationDate < currentDate) {
            return res.status(400).send({ status: "failure", message: "otp exprired" , data : {}});
        }
        if (otpInstance.isVerified) {
            return res.status(400).send({ status: "failure", message: "otp already used", data : {} });
        }
        otpInstance.isVerified = true
        await otpInstance.save();
        const user = await User.findOne({
            where:{
            phoneNumber:phoneNumber,
            }
        });
        if (user != null) {
            return res.status(200).send({ status: "success",message:"otp matched", data: {jwt_token:user.verifyToken} });    
        }
        const newUser = await User.create({
            phoneNumber: phoneNumber,
            isPhoneVerified: true,
        })
        const token = jwt.sign(
            {
                userId: newUser.id,
                iat: new Date(),
            },
            process.env.JWT_SECRET_KEY,
        );
        return res.status(200).send({ status: "success", message:"otp matched", data: {jwt_token:token} });   
    } catch (error) {
        return res.status(500).send({ status: "failure", message: error.message, data:{}});
    }
}

function otpGenerator(){
    var digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 4; i++ ) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}
