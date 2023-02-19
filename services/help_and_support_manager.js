const models = require('../models')

exports.pre_process_get_help_and_support = async (req) => {
   if(req.query.type == "coach"){
    data = [ "Start new batch", "Payment issues" , "Problem with batch details", "Update my details" , "Other" ]
       return data
   }else if(req.query.type == "player"){
    data = [ "Payment issues" , "Any new batch starting in my area" ]
       return data
   } 
}
exports.process_get_help_and_support = async (input_response) => {
    return input_response
}

exports.post_process_get_help_and_support = async (process_response, resp) => {
    return resp.status(200).send({ status: "Success", message: "Help and Support Fetched", data: process_response })
}