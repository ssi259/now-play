import jwt from 'jsonwebtoken';
const { User, Notification } = require('../../models'); 
const AWS = require('aws-sdk');

AWS.config.loadFromPath(__dirname +'/../../config/aws/config.json');
AWS.config.update({ region: 'ap-southeast-1' });

export const generateOtp = async (req, res) => {
    try {
        const { phoneNumber } = req.body;
        if (!phoneNumber) {
            const response = { status: 'Failure', Details: 'Phone Number Not Provided' }
            return res.status(400).send(response);
        }
        const otp = otpGenerator()
        const now = new Date();
        const expirationDate    = new Date(now.getTime() + 10 * 60000);
        const otpInstance = await Notification.create({
            otp: otp,
            expirationDate: expirationDate,
            isOtpVerified: false,
            phoneNumber: phoneNumber,
            channelType: "sms",
            notificationType:"otp"
        })
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

export const verifyOtp = async (req, res) => {
    try {
        const { phoneNumber, otp, lat, lng } = req.body;
        const currentDate = new Date();
        if (!phoneNumber) {
            const response = { "Status": "Failure", "Details": "Phone Number Not Provided" }
            return res.status(400).send(response)
        }
        if (!otp) {
            const response = { "Status": "Failure", "Details": "OTP not Provided" }
            return res.status(400).send(response);
        }
        const otpInstance = await Notification.findOne({ where: { phoneNumber: phoneNumber, notificationType:"otp" } });
        if (otpInstance != null) {
            if (!otpInstance.isOtpVerified) {
                if (otpInstance.expirationDate > currentDate) {
                    if (otpInstance.otp == otp) {
                        otpInstance.isOtpVerified = true
                        //discuss about this line
                        await otpInstance.save();
                        const userInstance = await User.create({
                            phoneNumber: phoneNumber,
                            isMobileVerified: true,
                        });
                        const token = jwt.sign(
                            {
                              user: {
                                userId: userInstance.id,
                                phoneNumber: userInstance.phoneNumber,
                                createdAt: new Date(),
                              },
                            },
                            process.env.JWT_SECRET_KEY,
                        );
                        userInstance.verifyToken = token;
                        //discuss about this line
                        await userInstance.save();
                        const response = { "Status": "Success", "Details": {user:userInstance, verifyToken:token} }
                        return res.status(200).send(response);
                    } else {
                        const response={"Status":"Failure","Details":"OTP Not Matched"}
                        return res.status(400).send(response);
                    }
                } else {
                    const response={"Status":"Failure","Details":"OTP Expired"}
                    return res.status(400).send(response);
                }
            } else {
                const response={"Status":"Failure","Details":"OTP Already Used"}
                return res.status(400).send(response);
            }
        } else {
            const response={"Status":"Failure","Details":"Bad Request"}
            return res.status(400).send(response);
        }
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
