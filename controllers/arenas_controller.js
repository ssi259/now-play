const ArenaManager = require("../services/arena_manager")
const {uploadFile} = require('../lib/upload_files_s3')


exports.create_arena = async(req,resp)=>{
        
    try{
        var input_response =  await ArenaManager.pre_process_create_arena(req,resp)
        var processed_reponse =  await ArenaManager.process_arena_input_req(input_response)
        var post_process_response = await ArenaManager.post_arena_process(req,resp,processed_reponse)
    }catch(e){
        console.log(e)
    }finally{
    }
}
exports.uploadArenaFiles = async (req, resp) =>{
    try {
        var input_response = await ArenaManager.pre_process_file_upload_request(req, resp);
        var processed_response = await ArenaManager.process_file_upload_request(input_response,resp);
    } catch (error) {
        resp.status(500).send({status:"Failure","Details":error.message})
    }
}