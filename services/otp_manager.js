require('dotenv').config();
const jwt = require('jsonwebtoken')
const sdk = require('api')('@gupshup/v1.0#3wb1b43l4wp80pp');
const { User, Notification } = require('../models'); 
const { Op } = require("sequelize");
const Api400Error = require('../error/api400Error')
const Api500Error = require('../error/api500Error')

exports.pre_process_generate = async (req) => {
    const { phone_number } = req.body;
    if (!phone_number) {
        throw new Api400Error("phone number not provided")
    }

    if (phone_number.length > 10) {
        throw new Api400Error("Invalide Phone Number Format")
    }
    return req.body
}

exports.process_generate = async (input) => {
    const { phone_number } = input
    const now = new Date();
    const expiration_date = new Date(now.getTime() + 10 * 60000);
    let otp;
    const [otp_instance , created] = await Notification.findOrCreate({
        where: {
            phoneNumber: phone_number,
            notificationType: "otp",
            isVerified:false,
            expirationDate: {
                [Op.gt]:now
            }
        },
        defaults: {
            expirationDate: expiration_date,
            otp: otp_generator(),
            channelType: "sms",
        }
    });
    otp = otp_instance.otp
    return {phone_number, otp}
}

exports.post_process_generate = async (input, resp) => {
    const { phone_number ,otp} = input
    sdk.sendMessagePOST({
        userid: process.env.GUPSHUP_USER_ID,
        password: process.env.GUPSHUP_PASSWORD,
        send_to: `91${phone_number}`,
        msg: `Please use the otp:${otp}  to verify your account in RUSH SPORTS (NOW DELIVERY).`,
        method: 'sendMessage',
        msg_type: 'text',
        format: 'json',
        auth_scheme: 'plain',
        v: 1.1
    }).then(() => {
        resp.status(200).send({status:"success",message:"otp sent successfully"})
    }).catch(() => {
        throw new Api500Error('error while sending otp')
    })
}

exports.pre_process_verify = async (req) => {
    const { phone_number, otp } = req.body;
    if (!phone_number) {
        throw new Api400Error("phone number not provided")
    }
    if (phone_number.length > 10) {
        throw new Api400Error("Invalide Phone Number Format")
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
        },
        order: [ [ 'createdAt', 'DESC' ]],
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

    const [user, created] = await User.findOrCreate({
        where: {
            phoneNumber: phone_number,
        },
        defaults: {
            isPhoneVerified: true,
        }
    })
    const token = jwt.sign(
        {
            user_id: user.id
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