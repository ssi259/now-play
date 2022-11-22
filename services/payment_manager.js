const models = require("../models");
const Api500Error = require('../error/api500Error')


exports.pre_process_create = async(req,resp)=>{
  var enrollment = await models.Enrollment.findOne({
    where: {
      user_id: req.user.user_id,
      subscription_id: req.body.plan_id,
      batch_id:req.body.batch_id
    }
})
var plan = await models.SubscriptionPlan.findOne({
  where: {
      id: req.body.plan_id
  }
})

return {enrollment, plan}
}
exports.process_create_input_req = async(req,input_response)=>{

  const {if_enrolled, plan} = input_response;

  if(if_enrolled.status == "pending") {
    await models.Enrollment.update({status: "inactive"}, {where: {user_id: req.user.user_id,batch_id:req.body.batch_id, subscription_id: req.body.plan_id}})
    await models.Payment.update({status: "failed"}, {where: {user_id: req.user.user_id,plan_id: req.body.plan_id,batch_id:req.body.batch_id}})

    await models.Payment.create({plan_id: req.body.plan_id,status: "pending",user_id: req.user.user_id,coach_id: req.body.coach_id})
    await models.Enrollment.create({batch_id:req.body.batch_id,user_id: user_id, subscription_id: req.body.plan_id,status: "pending"})
  } else {
    await models.Payment.create({plan_id: req.body.plan_id,status: "pending",user_id: req.user.user_id,coach_id: req.body.coach_id})
    await models.Enrollment.create({batch_id:req.body.batch_id,user_id: user_id, subscription_id: req.body.plan_id,status: "pending"})
  }
return {user_id: req.user.user_id , data:req.body, price: plan.price}
}
  
exports.post_create_process = async(req,resp,input_response)=>{
  var formatted_response = {}
  formatted_response["status"]="success"
  formatted_response["message"]="payment request created"
  delete input_response.dataValues.user_id
  formatted_response["data"]=input_response

  resp.status(200).send(formatted_response)
}