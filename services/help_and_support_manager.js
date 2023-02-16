const models = require('../models')

exports.pre_process_get_help_and_support = async (req) => {
   let help_and_support = [];
   if(req.query.type == "coach"){
       help_and_support = await models.Help_and_Support.findAll({where: {type: 'coach'}})
       return help_and_support
   }else if(req.query.type == "player"){
       help_and_support = await models.Help_and_Support.findAll({where: {type: 'player'}})
       return help_and_support
    }
}
exports.process_get_help_and_support = async (input_response) => {
    return input_response
}

exports.post_process_get_help_and_support = async (process_response, resp) => {
    return resp.status(200).send({ status: "Success", message: "Help and Support Fetched", data: process_response })
}



