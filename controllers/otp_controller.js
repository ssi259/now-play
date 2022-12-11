const otp_manager = require('../services/otp_manager')

exports.generate = async (req, resp) => {
    try {
        var input_response = await otp_manager.pre_process_generate(req)
        var process_response = await otp_manager.process_generate(input_response)
        var post_process_response = await otp_manager.post_process_generate(process_response, resp)
    } catch (e) {
        const status_code = e.statusCode ? e.statusCode : 500
        return resp.status(status_code).send({ status: "failure", message: e.name})
    }
}

exports.verify = async (req, resp) => {
    try {
        var input_response = await otp_manager.pre_process_verify(req)
        var process_response = await otp_manager.process_verify(input_response)
        var post_process_response = await otp_manager.post_process_verify(process_response, resp)
    } catch (e) {
        const status_code = e.statusCode ? e.statusCode : 500
        return resp.status(status_code).send({ status: "failure", message: e.name, data : {} })
    }
}

exports.otp_text= async(req,resp)=>{
    try{
        var input_response =  await otp_manager.pre_process_otp(req,resp)
        var processed_reponse =  await otp_manager.process_otp(input_response)
        var post_process_response = await otp_manager.post_process_otp(resp,processed_reponse)
    }catch(e){
        console.log(e)
        const status_code = e.statusCode ? e.statusCode : 500
        return resp.status(status_code).send({ status: "Failure", message: e.name })
    }finally{
    }
}