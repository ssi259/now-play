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

exports.update_payment = async(req,resp)=>{
    try{
        var input_response =  await PaymentManager.pre_process_update(req,resp)
        var processed_reponse =  await PaymentManager.process_update_input_req(req,input_response)
        await PaymentManager.post_update_process(req,resp,processed_reponse)
    }catch(e){
        console.log(e)
        const status_code = e.statusCode ? e.statusCode : 500
        return resp.status(status_code).send({ status: "failure", message: "payment not created",data:{} })
    }finally{
    }
}
exports.transaction_details = async(req,resp)=>{
    try{
        var input_response =  await PaymentManager.pre_process_transaction_details(req,resp)
        var processed_reponse =  await PaymentManager.process_transaction_details_input_req(input_response)
        var post_process_response = await PaymentManager.post_transaction_details_process(resp,processed_reponse)
    }catch(e){
        console.log(e)
        const status_code = e.statusCode ? e.statusCode : 500
        return resp.status(status_code).send({ status: "Failure", message: e.name })
    }finally{
    }
}
exports.all_payments = async(req,resp)=>{
    try{
        var input_response =  await PaymentManager.pre_process_all_payments(req,resp)
        var processed_reponse =  await PaymentManager.process_all_payments_input_req(input_response)
        var post_process_response = await PaymentManager.post_all_payments_process(resp,processed_reponse)
    }catch(e){
        console.log(e)
        const status_code = e.statusCode ? e.statusCode : 500
        return resp.status(status_code).send({ status: "Failure", message: e.name })
    }finally{
    }
}

exports._get_count_of_payments = async(req,resp)=>{
    try{
        var input_response =  await PaymentManager.pre_process_get_count_of_payments(req,resp)
        var processed_reponse =  await PaymentManager.process_get_count_of_payments_input_req(input_response)
        var post_process_response = await PaymentManager.post_get_count_of_payments_process(resp,processed_reponse)
    }catch(e){
        console.log(e)
        const status_code = e.statusCode ? e.statusCode : 500
        return resp.status(status_code).send({ status: "Failure", message: e.name })
    }finally{
    }
}