const ArenaManager = require("../services/arena_manager")


exports.create_arena = async(req,resp)=>{
        
    try{
        var input_response =  await ArenaManager.pre_process_create_arena(req,resp)
        var processed_reponse =  await ArenaManager.process_arena_input_req(input_response)
        var post_process_response = await ArenaManager.post_arena_process(req,resp,processed_reponse)
    }catch(e){
        console.log(e)
        const status_code = e.statusCode ? e.statusCode : 500
        return resp.status(status_code).send({ status: "Failure", message: e.name })
    }finally{
    }
}

exports.uploadArenaImages = async (req, resp) =>{
    try {
        var processed_response = await ArenaManager.process_image_upload_request(req,resp);
    } catch (error) { 
        resp.status(500).send({status:"Failure","Details":error.message})
    }
}

exports.arena_details = async(req,resp)=>{
        
    try{
        var input_response =  await ArenaManager.pre_process_arena_details(req,resp)
        var processed_reponse =  await ArenaManager.process_arena_details_input_req(input_response)
        var post_process_response = await ArenaManager.post_arena_details_process(req,resp,processed_reponse)
    }catch(e){
        console.log(e)
        const status_code = e.statusCode ? e.statusCode : 500
        return resp.status(status_code).send({ status: "Failure", message: e.name })
    }finally{
    }
}


exports.arenas_details = async(req,resp)=>{
        
    try{
        var input_response =  await ArenaManager.pre_process_arenas_details(req,resp)
        var processed_reponse =  await ArenaManager.process_arenas_details_input_req(input_response)
        var post_process_response = await ArenaManager.post_arenas_details_process(req,resp,processed_reponse)
    }catch(e){
        console.log(e)
        const status_code = e.statusCode ? e.statusCode : 500
        return resp.status(status_code).send({ status: "Failure", message: e.name })
    }finally{
    }
}