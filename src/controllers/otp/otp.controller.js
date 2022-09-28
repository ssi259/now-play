const {Otp} = require('../../models'); 
const otpGenerator = require('otp-generator');
const AWS = require('aws-sdk');
const fast2sms = require('fast-two-sms');





AWS.config.loadFromPath(__dirname +'/../../config/aws/config.json');

AWS.config.update({ region: 'ap-south-1' });

export const generateOtp = async (req, res) => {
    try {
        const { phone_number } = req.body;
        if (!phone_number) {
            const response = { status: 'Failure', Details: 'Phone Number Not Provided' }
            return res.statut(400).send(response);
        }
        const otp = otpGenerator.generate(4, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
        const now = new Date();
        const expiration_time = new Date(now.getTime() + 2 * 60000);
        const otp_instance = await Otp.create({
            otp: otp,
            expiration_time: expiration_time,
            verified: false,
            phone_number: phone_number,
            userId:1,
        })
        const phone_message =
            `Dear User,\n`
            + `${otp} is your otp for Phone Number Verfication. Please enter the OTP to verify your phone number.\n`
        const params = {
            Message: phone_message,
            PhoneNumber:phone_number
        }
        
        var options = {
            authorization : "8IhgxB2tp5ZrSUfzn9W6LAC07jXyuFRTmGDqvJ4KbadeE1MO3Ng3rlAnoScD8jWpfFTudLqZwCe61tP9",
            message : ' This is a test OTP Code Message',
            numbers : ['7376235783']
        } ;
        // send this message
        fast2sms.sendMessage(options)
            .then((response) => {
                console.log("f2sms result", response)
                // return res.status(200).send(response)
            })
            .catch((err) => {
                console.log("f2sms err", err);
                // return res.status(400).send(err)
            })

            return res.status(200).send('sms sent')
        // var publishTextPromise = new AWS.SNS({ apiVersion: '2012-11-05' }).publish(params).promise();
        // publishTextPromise.then((data) => {
        //     console.log("message",data)
        //     return res.status(200).send({"status":"Success","Details":"Otp Send to SNS"})
        // }).catch((err) => {
        //     return res.send({status:"Failure",Details:err})
        // })
    } catch (error) {
        const response = { status: "Failure", Details: error.message }
        return res.status(400).send(response);
    }
};


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
        const otp_instance = await Otp.findOne({ where: { phone_number: phone_number } });
        if (otp_instance != null) {
            if (!otp_instance.varified) {
                if (otp_instance.expiration_time > current_time) {
                    if (otp_instance.otp == otp) {
                        otp_instance.varified = true
                        otp_instance.save();
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
