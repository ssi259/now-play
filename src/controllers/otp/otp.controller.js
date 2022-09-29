const {Otp, User} = require('../../models'); 
const AWS = require('aws-sdk');

AWS.config.loadFromPath(__dirname +'/../../config/aws/config.json');

AWS.config.update({ region: 'ap-southeast-1' });

export const generateOtp = async (req, res) => {
    try {
        const { phone_number } = req.body;
        if (!phone_number) {
            const response = { status: 'Failure', Details: 'Phone Number Not Provided' }
            return res.statut(400).send(response);
        }
        const otp = otpGenerator()
        const now = new Date();
        const expiration_time = new Date(now.getTime() + 10 * 60000);
        const otp_instance = await Otp.create({
            otp: otp,
            expiration_time: expiration_time,
            verified: false,
            phone_number: phone_number,
            userId:1,
        })
        const phone_message =
            `Dear User,\n`
            + `${otp} is your otp for Phone Number Verfication. Please enter the OTP to verify your phone number`
        const params = {
            Message: phone_message,
            PhoneNumber:phone_number
        }
        var publishTextPromise = new AWS.SNS({ apiVersion: '2010-03-31' }).publish(params).promise();
        publishTextPromise.then((data) => {
            return res.status(200).send({"status":"Success","Details":"Otp Send to SNS"})
        }).catch((err) => {
            return res.send({status:"Failure",Details:err})
        })
    } catch (error) {
        const response = { status: "Failure", Details: error.message }
        return res.status(400).send(response);
    }
};

function otpGenerator(){
    var digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 4; i++ ) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}

export const verifyOtp = async (req, res) => {
    try {
        const { phone_number, otp } = req.body;
        const current_time = new Date();
        if (!phone_number) {
            const response = { "Status": "Failure", "Details": "Phone Number Not Provided" }
            return res.status(400).send(response)
        }
        if (!otp) {
            const response = { "Status": "Failure", "Details": "OTP not Provided" }
            return res.status(400).send(response);
        }
        console.log
        const otp_instance = await Otp.findOne({ where: { phone_number: phone_number} });
        if (otp_instance != null) {
            if (!otp_instance.varified) {
                console.log("otp instance",otp_instance)
                if (otp_instance.expiration_time > current_time) {
                    if (otp_instance.otp == otp) {
                        otp_instance.varified = true
                        otp_instance.save();
                        const user_instance = await User.findOne({ where: { PhoneNumber: phone_number } })
                        console.log("user",user_instance)
                        user_instance.isMobileVerified = true;
                        console.log("user",user_instance)
                        user_instance.save();
                        const response = { "Status": "Success", "Details": "Otp Matched" }
                        return res.status(200).send(response);
                    } else {
                        const response={"Status":"Failure","Details":"Otp Not Matched"}
                        return res.status(400).send(response);
                    }
                } else {
                    const response={"Status":"Failure","Details":"Otp Expired"}
                    return res.status(400).send(response);
                }
            } else {
                const response={"Status":"Failure","Details":"Otp Already Used"}
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
