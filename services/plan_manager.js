const models = require('../models')



exports.pre_process_create(req) = async (req) => {
    const req_input_data = req.body
    return req_input_data
}

exports.process_create = async (req) => {
    await models.SubscriptionPlan.create({

    })
    return 
}

exports.post_process_create = async (resp) => {
    
}
