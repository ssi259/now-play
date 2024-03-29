require('dotenv').config();
const jwt = require('jsonwebtoken')
const sdk = require('api')('@gupshup/v1.0#3wb1b43l4wp80pp');
const models = require('../models'); 
const { Op } = require("sequelize");
const Api400Error = require('../error/api400Error')
const Api500Error = require('../error/api500Error')

exports.pre_process_generate = async (req) => {
    const { phone_number , type } = req.body;
    if (!phone_number) {
        throw new Api400Error("phone number not provided")
    }
    if (phone_number.length > 10) {
        throw new Api400Error("Invalide Phone Number Format")
    }
    if (type == null) {
        throw new Api400Error("user type not provided")
    }
    return req.body
}

exports.process_generate = async (input) => {
    const { phone_number , type } = input
    if (type == 'coach') {
        const coach = await models.Coach.findOne({
            where: {
                phone_number: phone_number,
            }
        })
        if (!coach) {
            throw new Api400Error("You are not registered with us")
        }
    }
    const now = new Date();
    const expiration_date = new Date(now.getTime() + 10 * 60000);
    let otp;
    const [otp_instance , created] = await models.Otp.findOrCreate({
        where: {
            phone_number: phone_number,
            is_verified:false,
            expiration_date: {
                [Op.gt]:now
            }
        },
        defaults: {
            expiration_date: expiration_date,
            otp: otp_generator(phone_number,type),
        }
    });
    otp = otp_instance.otp
    return {phone_number, otp }
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
    const { phone_number, otp, type } = req.body;
    if (type == null) {
        throw new Api400Error("user type not provided")
    }
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
    const { phone_number, otp, type } = input 
    const current_date = new Date();
    const otp_instance = await models.Otp.findOne({
        where:
        {
            otp: otp,
            phone_number: phone_number,
        },
        order: [ [ 'createdAt', 'DESC' ]],
    });
    if (!otp_instance) {
        throw new Api400Error("otp not matched")
    }
    if (otp_instance.expiration_date < current_date) {
        throw new Api400Error("otp exprired")
    }
    if (otp_instance.is_verified) {
        throw new Api400Error("otp already used")
    }
    otp_instance.is_verified = true
    await otp_instance.save();

    if (type == 'player') {
        const [user, created] = await models.User.findOrCreate({
            where: {
                phoneNumber: phone_number,
            },
            defaults: {
                isPhoneVerified: true,
            }
        }) 
        return  jwt.sign(
            {
                user_id: user.id,
                type:"player"
            },
            process.env.JWT_SECRET_KEY,
        );
    }
    if (type == 'coach') {
        const [coach, created] = await models.Coach.findOrCreate({
            where: {
                phone_number: phone_number,
            }
        })
        return  jwt.sign(
            {
                coach_id: coach.id,
                type:"coach"
            },
            process.env.JWT_SECRET_KEY,
        );
    }
}

exports.post_process_verify = async (token,resp) => {
    resp.status(200).send({ status: "success", message:"otp matched", data: {jwt_token:token} }); 
}

function otp_generator(phone_number, type) {
    var digits = '0123456789';
    let otp = '';
    if (type == 'player' && phone_number == '2345678901') {
        otp  = '1008'
    }
    else if (type == 'coach' && phone_number == '2345678902') {
        otp = '1080'
    }
    else {
        for (let i = 0; i < 4; i++) {
            otp += digits[Math.floor(Math.random() * 10)];
        }
    }
    return otp;
}

exports.pre_process_otp = async(req,resp)=>{
    return { "phone_number": req.query.phone_number };
}

exports.process_otp = async(input_response)=>{
    const {phone_number} = input_response
    const otp_msg = await  models.Otp.findAll({
        where: { 
        phone_number: phone_number}})
        if (otp_msg) {
            const otp = otp_msg[otp_msg.length-1].otp
            return {"otp":otp}
        } else {
            throw new Api400Error('Error in finding otp');
        }
}

exports.post_process_otp = async(resp,input_response)=>{
    resp.status(200).send({ "data": input_response });
}