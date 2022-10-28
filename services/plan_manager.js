const models = require('../models')
const Api400Error = require('../error/api400Error')

exports.pre_process_create = async (req) => {
    const { batch_id, plan_name, price } = req.body
    if (!batch_id) {
        throw new Api400Error("Batch ID Not Provided")
    }
    if (!plan_name) {
        throw new Api400Error("Plan Name Not Provided")
    }
    if (!price) {
        throw new Api400Error("Price Not Provided")
    }
    return req.body
}

exports.process_create = async (input_data) => {
    return await models.SubscriptionPlan.create(input_data)
}

exports.post_process_create = async (subscription_plan,resp) => {
    resp.status(200).send({status:"Success",data:subscription_plan})
}
