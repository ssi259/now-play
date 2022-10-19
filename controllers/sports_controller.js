const SportManager = require("../services/sport_manager")

exports.create_sport = async(req,resp)=>{
        
    try{
        var input_response =  await SportManager.pre_process_create_sport(req,resp)
        var processed_reponse =  await SportManager.process_sport_input_req(input_response)
        var post_process_response = await SportManager.post_create_sport_process(req,resp,processed_reponse)
    }catch(e){
        console.log(e)
    }finally{
    }
}
exports.sports_list = async(req,resp)=>{

    try{
        var input_response =  await SportManager.pre_process_sports_list(req,resp)
        var processed_reponse =  await SportManager.process_sports_list_input_req(input_response)
        var post_process_response = await SportManager.post_sports_list_process(req,resp,processed_reponse)
    }catch(e){
        console.log(e)
    }finally{
    }
}