
const PaymentManager = require("../services/payment_manager")


exports.create_payment = async(req,resp)=>{

    try{
        var input_response =  await PaymentManager.pre_process_create(req,resp)
        var processed_reponse =  await PaymentManager.process_create_input_req(req,input_response)
        await PaymentManager.post_create_process(req,resp,processed_reponse)
    }catch(e){
        console.log(e)
        const status_code = e.statusCode ? e.statusCode : 500
        return resp.status(status_code).send({ status: "Failure", message: "payment not created" })
    }finally{
    }
}