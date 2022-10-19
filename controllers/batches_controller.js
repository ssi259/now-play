const BatchManager = require("../services/batch_manager")

exports.search_batch = async(req,resp)=>{
        
    try{
        var input_response =  await BatchManager.pre_process_params(req,resp)
        var processed_reponse =  await BatchManager.process_batch_input_req(input_response)
        var post_process_response = await BatchManager.post_process(req,resp,processed_reponse)
    }catch(e){
        console.log(e)
    }finally{
    }
}
exports.create_batch = async(req,resp) =>{

    try{
        var input_response = await BatchManager.pre_process_create_batch(req,resp)
        var processed_reponse =  await BatchManager.process_batch_input_req(input_response)
        var post_process_response = await BatchManager.post_process(req,resp,processed_reponse)
    }catch(e){
        console.log(e)
    }finally{
    }
}
exports.batch_details = async(req,resp) =>{

    try{
        var input_response = await BatchManager.pre_process_batch_details(req,resp)
        var processed_reponse =  await BatchManager.process_batch_details_input_req(input_response)
        var post_process_response = await BatchManager.post_process(req,resp,processed_reponse)
    }catch(e){
        console.log(e)
    }finally{
    }
}