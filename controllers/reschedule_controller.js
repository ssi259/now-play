const RescheduleManager = require("../services/reschedule_manager")

exports.rescheduling = async(req,resp)=>{      
    try{
        var input_response =  await RescheduleManager.pre_process_reschedule(req,resp)
        var processed_reponse =  await RescheduleManager.process_reschedule_input_req(req,resp,input_response)
        var post_process_response = await RescheduleManager.post_reschedule_process(resp,processed_reponse)
    }catch(e){
        console.log(e)
        const status_code = e.statusCode ? e.statusCode : 500
        return resp.status(status_code).send({ status: "Failure", message: e.name })
    }finally{
    }
}