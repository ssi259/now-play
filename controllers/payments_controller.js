const PaymentManager = require("../services/payment_manager")


exports.create_payment = async(req,resp)=>{
        
    try{
        var input_response =  await PaymentManager.pre_process_create_payment(req,resp)
        var processed_reponse =  await PaymentManager.process_payment_input_req(input_response)
        var post_process_response = await PaymentManager.post_payment_process(req,resp,processed_reponse)
    }catch(e){
        console.log(e)
        const status_code = e.statusCode ? e.statusCode : 500
        return resp.status(status_code).send({ status: "Failure", message: e.name })
    }finally{
    }
}
exports.update_payment = async(req,resp) =>{

    try{
        var input_response = await PaymentManager.pre_process_update_payment(req,resp)
        var processed_reponse =  await PaymentManager.process_update_payment_input_req(input_response)
        var post_process_response = await PaymentManager.post_process_update_payment(req,resp,processed_reponse)
    }catch(e){
        const status_code = e.statusCode ? e.statusCode : 500
        return resp.status(status_code).send({ status: "Failure", message: e.name })
    }finally{
    }
}