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
        await AcademyManager.process_image_upload_request(input_response, resp)
        await AcademyManager.post_process_image_upload(req,resp)
    } catch (error) { 
        console.log("error",error)
        resp.status(error.statusCode).send(error)
    }
}