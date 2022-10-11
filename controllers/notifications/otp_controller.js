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
            const response = { status: 'Failure', Details: 'Phone Number Not Provided' }
            return res.status(400).send(response);
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
        var publishTextPromise = new AWS.SNS({ apiVersion: '2010-03-31' }).publish(params).promise();
        publishTextPromise.then((data) => {
            return res.status(200).send({"status":"Success","Details":"OTP Sent Successfully"})
        }).catch((err) => {
            return res.send({status:"Failure",Details:err})
        })
    } catch (error) {
        const response = { status: "Failure", Details: error.message }
        return res.status(400).send(response);
    }
};

exports.verifyOtp = async (req, res) => {
    try {
        const { phoneNumber, otp } = req.body;
        const currentDate = new Date();
        if (!phoneNumber) {
            const response = { "Status": "Failure", "Details": "Phone Number Not Provided" }
            return res.status(400).send(response)
        }
        if (!otp) {
            const response = { "Status": "Failure", "Details": "OTP not Provided" }
            return res.status(400).send(response);
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
            return res.status(400).send({ "Status": "Failure", "Details": "OTP Not Matched" });
        }

        if (otpInstance.expirationDate < currentDate) {
            return res.status(400).send({ "Status": "Failure", "Details": "OTP Expired" });
        }

        if (otpInstance.isVerified) {
            return res.status(400).send({ "Status": "Failure", "Details": "OTP Already Used" });
        }
        
        otpInstance.isVerified = true
        await otpInstance.save();

        const user = await User.findOne({
            where:{
            phoneNumber:phoneNumber,
            }
        });
        if (user != null) {
            return res.status(200).send({ "Status": "Success", "Details": {user:user,verifyToken:user.verifyToken} });    
        }
        const newUser = await User.create({
            phoneNumber: phoneNumber,
            isPhoneVerified: true,
        })
        const token = jwt.sign(
            {
                user: {
                userId: newUser.id,
                phoneNumber: phoneNumber,
                createdAt: new Date(),
                },
            },
            process.env.JWT_SECRET_KEY,
        );
        newUser.verifyToken = token;
        await newUser.save();
        return res.status(200).send({ "Status": "Success", "Details": {user:newUser,verifyToken:token} });   
    } catch (error) {
        const response = { status: "Failure", Details: error.message }
        return res.status(400).send(response);
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
