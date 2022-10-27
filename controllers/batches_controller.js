const BatchManager = require("../services/batch_manager")

exports.search_batch = async(req,resp)=>{
        
    try{
        var input_response =  await BatchManager.pre_process_params(req,resp)
        var processed_reponse =  await BatchManager.process_batch_search_input_req(input_response)
        var post_process_response = await BatchManager.post_process_search_batch(req,resp,processed_reponse)
    }catch(e){
        const status_code = e.statusCode ? e.statusCode : 500
        console.log(e)
        return resp.status(status_code).send({ status: "Failure", message: e.name })
    }finally{
    }
}
exports.create_batch = async(req,resp) =>{

    try{
        var input_response = await BatchManager.pre_process_create_batch(req,resp)
        var processed_reponse =  await BatchManager.process_batch_create_input_req(input_response)
        var post_process_response = await BatchManager.post_process_create_batch(resp,processed_reponse)
    }catch(e){
        const status_code = e.statusCode ? e.statusCode : 500
        return resp.status(status_code).send({ status: "failure", message: e.name, data:{} })
    }finally{
    }
}
exports.uploadImage = async(req,resp)=>{
    try{
        var input_request = await BatchManager.pre_process_image_upload_request(req,resp)
        await BatchManager.process_image_upload_request(input_request,resp)
    }catch(error){
        resp.status(error.statusCode).send(error.name)
    }
}
exports.batch_details = async(req,resp) =>{

    try{
        var input_response = await BatchManager.pre_process_batch_details(req,resp)
        var processed_reponse =  await BatchManager.process_batch_details_input_req(req,input_response)
        var post_process_response = await BatchManager.post_process(req,resp,processed_reponse)

    }catch(e){
        const status_code = e.statusCode ? e.statusCode : 500
        return resp.status(status_code).send({ status: "Failure", message: e.name })
    }finally{
    }
}

exports.get_upcoming_classes = async (req, resp) => {
    try {
        var input_response = await BatchManager.pre_process_upcoming_classes(req)
        var processed_response = await BatchManager.process_upcoming_classes(input_response)
        await BatchManager.post_process_upcoming_classes(processed_response, resp)
    } catch (e) {
        const status_code = e.statusCode ? e.statusCode : 500
        return resp.status(status_code).send({ status: "failure", message: e.name })
    }
}
exports.update_batch = async(req,resp) =>{

    try{
        var input_response = await BatchManager.pre_process_update_batch(req,resp)
        var processed_reponse =  await BatchManager.process_update_batch_input_req(input_response)
        var post_process_response = await BatchManager.post_process_update_batch(req,resp,processed_reponse)
    }catch(e){
        const status_code = e.statusCode ? e.statusCode : 500
        return resp.status(status_code).send({ status: "Failure", message: e.name })
    }finally{
    }
}
