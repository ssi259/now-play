const models = require('../models')

exports.pre_process_get_help_and_support = async (req) => {
    return {};
}

exports.process_get_help_and_support = async (req) => {
    const type = req.body.type;
    if( type == "coach"){
        const help_and_support = await models.HelpAndSupport.findAll({
            where: {
                type: "coach"
            }
        });
    }else if( type == "player"){    
        const help_and_support = await models.HelpAndSupport.findAll({
            where: {
                type: "player"
            }
        });
    }
    return help_and_support;    
}

exports.post_process_get_help_and_support = async (process_response, resp) => {
    return resp.status(200).send({ status: "Success", message: "Help and Support Fetched", data: process_response })
}



