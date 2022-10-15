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