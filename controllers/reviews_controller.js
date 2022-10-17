const ReviewManager = require("../services/review_manager")

exports.create_review = async(req,resp)=>{
        
    try{
        var input_response =  await ReviewManager.pre_process_create_review(req,resp)
        var processed_reponse =  await ReviewManager.process_review_input_req(input_response)
        var post_process_response = await ReviewManager.post_review_process(req,resp,processed_reponse)
    }catch(e){
        console.log(e)
    }finally{
    }
}