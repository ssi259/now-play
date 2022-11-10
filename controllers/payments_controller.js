
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
exports.transaction_details = async(req,resp)=>{
        
    try{
        var input_response =  await PaymentManager.pre_process_arena_details(req,resp)
        var processed_reponse =  await PaymentManager.process_arena_details_input_req(input_response)
        var post_process_response = await PaymentManager.post_arena_details_process(req,resp,processed_reponse)
    }catch(e){
        console.log(e)
        const status_code = e.statusCode ? e.statusCode : 500
        return resp.status(status_code).send({ status: "Failure", message: e.name })
    }finally{
    }
}