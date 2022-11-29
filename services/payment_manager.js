const models = require("../models");
const Api500Error = require('../error/api500Error')


exports.pre_process_create = async(req,resp)=>{
  var plan = await models.SubscriptionPlan.findOne({
    where: {
        id: req.body.plan_id
    }
})
  return {user_id: req.user.user_id , data:req.body, price: plan.price}  
}
exports.process_create_input_req = async(req,input_response)=>{
  const { user_id ,price} = input_response
  const result = await  models.Payment.create({plan_id: req.body.plan_id,price: price,status: "pending",user_id: user_id,coach_id: req.body.coach_id})
  if(result){
    await models.Enrollment.create({batch_id:req.body.batch_id,user_id: user_id, subscription_id: req.body.plan_id,status: "pending"})
  }
  return result
}
  
exports.post_create_process = async(req,resp,input_response)=>{
  var formatted_response = {}
  formatted_response["status"]="success"
  formatted_response["message"]="payment request created"
  delete input_response.dataValues.user_id
  formatted_response["data"]=input_response

  resp.status(200).send(formatted_response)
  resp.status(200).send(input_response)
}
exports.pre_process_transaction_details = async(req,resp)=>{
  const transaction_details = await models.Payment.findAll({where: { user_id:req.user.user_id}})
      if (transaction_details) {
          return transaction_details;
      } else {
        throw new Api500Error(`Bad Request`)
      }

}
exports.process_transaction_details_input_req = async(input_response)=>{
  return input_response
}
exports.post_transaction_details_process = async(req,resp,input_response)=>{
  resp.status(200).send(input_response)
}