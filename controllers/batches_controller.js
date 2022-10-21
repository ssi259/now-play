const BatchManager = require("../services/batch_manager")
const models = require('../models');


exports.search_batch = async(req,resp)=>{
        
    try{
        var input_response =  await BatchManager.pre_process_params(req,resp)
        var processed_reponse =  await BatchManager.process_batch_search_input_req(input_response)
        var post_process_response = await BatchManager.post_process_search_batch(req,resp,processed_reponse)
    }catch(e){
        resp.status(error.statusCode).send(error.name)
    }finally{
    }
}
exports.create_batch = async(req,resp) =>{

    try{
        var input_response = await BatchManager.pre_process_create_batch(req,resp)
        var processed_reponse =  await BatchManager.process_batch_create_input_req(input_response)
        var post_process_response = await BatchManager.post_process_create_batch(req,resp,processed_reponse)
    }catch(e){
        resp.status(error.statusCode).send(error.name)
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
        var processed_reponse =  await BatchManager.process_batch_details_input_req(input_response)
        var post_process_response = await BatchManager.post_process_create_batch(req,resp,processed_reponse)

    }catch(e){
        resp.status(e.statusCode).send(e.name)
    }finally{
    }
}
