const SportManager = require("../services/sport_manager")

exports.create_sport = async(req,resp)=>{
        
    try{
        var input_response =  await SportManager.pre_process_create_sport(req,resp)
        var processed_reponse =  await SportManager.process_sport_input_req(input_response)
        var post_process_response = await SportManager.post_create_sport_process(req,resp,processed_reponse)
    }catch(e){
        const status_code = e.statusCode ? e.statusCode : 500
        return resp.status(status_code).send({ status: "Failure", message: e.name })
    }finally{
    }
}
exports.sports_list = async(req,resp)=>{

    try{
        var input_response =  await SportManager.pre_process_sports_list(req,resp)
        var processed_reponse =  await SportManager.process_sports_list_input_req(input_response)
        var post_process_response = await SportManager.post_sports_list_process(req,resp,processed_reponse)
    }catch(e){
        const status_code = e.statusCode ? e.statusCode : 400
        return resp.status(status_code).send({ status: "Failure", message: e.name })
    }finally{
    }
}

exports.uploadSportImages = async (req, resp) =>{
    try {
        var input_response = await SportManager.pre_process_image_upload_request(req)
        await SportManager.process_image_upload_request(input_response)
        await SportManager.post_process_image_upload_request(resp)
    } catch (e) { 
        const status_code = e.statusCode ? e.statusCode : 500
        resp.status(status_code).send({status:"Failure",message:e.name})
    }
}

exports.sport_list = async(req,resp)=>{

    try{
        var input_response =  await SportManager.pre_process_sport_list(req,resp)
        var processed_reponse =  await SportManager.process_sport_list_input_req(input_response)
        var post_process_response = await SportManager.post_sport_list_process(req,resp,processed_reponse)
    }catch(e){
        const status_code = e.statusCode ? e.statusCode : 400
        return resp.status(status_code).send({ status: "Failure", message: e.name })
    }finally{
    }
}
