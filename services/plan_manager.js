const models = require('../models')
const Api400Error = require('../error/api400Error')
const Api500Error = require('../error/api500Error')
const {Op} = require('sequelize')

exports.pre_process_create = async (req) => {
    const { batch_id, plan_name, price } = req.body
    if (!batch_id) {
        throw new Api400Error("Batch ID Not Provided")
    }
    if (!plan_name) {
        throw new Api400Error("Plan Name Not Provided")
    }
    if (price == null ) {
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


exports.pre_process_get_plan_by_batch_id = async (req) => {
    if (req.query == null ||  req.query.batch_id == null) {
        throw new Api400Error("Batch ID Not Provided")
    }
    return {user_id : req.user.user_id , batch_id :req.query.batch_id}
}

exports.process_get_plan_by_batch_id = async (input_data) => {
    const { user_id, batch_id } = input_data
    const enrollment = await models.Enrollment.findOne({
        where: {
            user_id: user_id,
            batch_id:batch_id
        }
    })
    if (enrollment == null) {
        return await models.SubscriptionPlan.findAll({
            where: {
                batch_id : batch_id
            }
        })
    }
    return  await models.SubscriptionPlan.findAll({
        where: {
            batch_id: batch_id,
            price: {
                [Op.gt]: 0
            }
        }
    })
}

exports.post_process_get_plan_by_batch_id = async (plan,resp) => {
    resp.status(200).send({status:"Success",data:plan})
}

exports.pre_process_update_plan = async (req) => {
    return {plan_id:req.params.id, data:req.body}
}
  
exports.process_update_plan_input_req = async (input_data) => {
   const { plan_id, data } = input_data
   const [affected_rows] = await models.SubscriptionPlan.update(data, {
      where: {
          id:plan_id
      },
    })
    if (!affected_rows) {
      throw new Api400Error("invalid request")
    }
}
  
exports.post_process_plan_batch = async (resp) => {
    resp.status(200).send({status:"success",message:"plan updated successfully"})
}  

exports.pre_process_get_all_plans = async (req) => {
    const allPlans = await models.SubscriptionPlan.findAll()
    return allPlans;
}

exports.process_get_all_plans_input_req = async (input_response) => {
    return input_response
}

exports.post_process_get_all_plans = async (plans,resp) => {
    resp.status(200).send({status:"success",data:plans})
}

