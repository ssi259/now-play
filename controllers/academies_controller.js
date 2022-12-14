const AcademyManager = require("../services/academy_manager")

exports.create_academy = async(req,resp)=>{
        
    try{
        var input_response =  await AcademyManager.pre_process_create_academy(req,resp)
        var processed_reponse =  await AcademyManager.process_create_academy_input_req(input_response)
        var post_process_response = await AcademyManager.post_create_academy_process(req,resp,processed_reponse)
    }catch(e){
        console.log(e)
    }finally{
    }
}

exports.uploadAcademyImages = async (req, resp) =>{
    try {
        var input_response = await AcademyManager.pre_process_image_upload_request(req,resp)
        await AcademyManager.process_image_upload_request(input_response)
        await AcademyManager.post_process_image_upload(resp)
    } catch (e) {
        const status_code = e.statusCode ? e.statusCode : 500
        return resp.status(status_code).send({ status: "Failure", message: e.name })
    }        
}

exports.academy_list = async(req,resp)=>{
        
    try{
        var input_response =  await AcademyManager.pre_process_academy_list(req,resp)
        var processed_reponse =  await AcademyManager.process_academy_list_input_req(input_response)
        var post_process_response = await AcademyManager.post_academy_list_process(req,resp,processed_reponse)
    }catch(e){
        console.log(e)
        const status_code = e.statusCode ? e.statusCode : 500
        return resp.status(status_code).send({ status: "Failure", message: e.name })
    }finally{
    }
}


exports.academy_details = async(req,resp) =>{

    try{
        var input_response = await AcademyManager.pre_process_academy_details(req,resp)
        var processed_reponse =  await AcademyManager.process_academy_details_input_req(input_response)
        var post_process_response = await AcademyManager.post_process_academy_details(req,resp,processed_reponse)

    }catch(e){
        const status_code = e.statusCode ? e.statusCode : 500
        return resp.status(status_code).send({ status: "Failure", message: e.name })
    }finally{
    }
}
exports.update_academy = async(req,resp)=>{
        
    try{
        var input_response =  await AcademyManager.pre_process_update_academy(req)
        await AcademyManager.process_update_academy_input_req(input_response)
        await AcademyManager.post_update_academy_process(resp)
    }catch(e){
        const status_code = e.statusCode ? e.statusCode : 500
        return resp.status(status_code).send({ status: "Failure", message: e.name })
    }finally{
    }
}