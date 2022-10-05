const BatchManager = require("../services/batch_manager")

exports.search_batch = async(req,resp)=>{
        
    try{
        var input_response =  await BatchManager.pre_process_params(req,resp)
        exports.process_batch_input_req = async(input_response)=>{ return input_response }
        exports.post_process = async(req,resp,input_response)=>{ resp.send(input_response)}
        exports.pre_process_params = async(req,resp)
    }catch(e){
        console.log(e)
    }finally{
    }
}
exports.create_batch = async(req,resp) =>{

       try{
       var input_response = await BatchManager.pre_process_create_batch(req,resp)
       exports.post_process = async(req,resp,input_response)=>{ resp.send(input_response)}
       exports.pre_process_params = async(req,resp)
        }catch(e){
            console.log(e)
        }finally{
        }
}