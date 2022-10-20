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
        var processed_response = await AcademyManager.process_image_upload_request(req,resp);
    } catch (error) { 
        resp.status(500).send({status:"Failure","Details":error.message})
    }
}