const BatchManager = require("../services/batch_manager")
var lib = require('../lib/upload_images')

exports.search_batch = async(req,resp)=>{
        
    try{
        var input_response =  await BatchManager.pre_process_params(req,resp)
        var processed_reponse =  await BatchManager.process_batch_search_input_req(input_response)
        var post_process_response = await BatchManager.post_process_search_batch(req,resp,processed_reponse)
    }catch(e){
        console.log(e)
    }finally{
    }
}
exports.create_batch = async(req,resp) =>{

    try{
        var input_response = await BatchManager.pre_process_create_batch(req,resp)
        var processed_reponse =  await BatchManager.process_batch_create_input_req(input_response)
        var post_process_response = await BatchManager.post_process_create_batch(req,resp,processed_reponse)
    }catch(e){
        console.log(e)
    }finally{
    }
}
exports.uploadedImage = async(req,resp)=>{
    lib.uploadedImage(req.files.files_name),
    resp.send({
    success: true,
    message:"file Uploaded"                                                                                                                                                                                                
  })
}
