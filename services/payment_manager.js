const models = require("../models");
const Api500Error = require('../error/api500Error')
function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
exports.pre_process_create = async(req,resp)=>{
  var plan = await models.SubscriptionPlan.findOne({
    where: {
        id: req.body.plan_id
    }
  })
  return {plan}
}
exports.process_create_input_req = async(req,input_response)=>{
  const {plan} = input_response;
  var enrollent_type = plan.price==0?"free":"paid";
  await models.Enrollment.update({status: "inactive"}, {where: {user_id: req.user.user_id,batch_id:req.body.batch_id, status: "pending"}})
  await models.Payment.update({status: "failed"}, {where: {user_id: req.user.user_id, coach_id: req.body.coach_id, batch_id:req.body.batch_id,status: "pending"}})
  await models.Payment.create({plan_id: req.body.plan_id,status: "pending",batch_id:req.body.batch_id, user_id: req.user.user_id,coach_id: req.body.coach_id, price: plan.price, payment_mode: "Cash"})
  await models.Enrollment.create({batch_id:req.body.batch_id,user_id: req.user.user_id, subscription_id: req.body.plan_id, status: "pending", type:enrollent_type, coach_id: req.body.coach_id})
  return {user_id: req.user.user_id , dataValues:req.body, price: plan.price}
}
exports.post_create_process = async(req,resp,input_response)=>{
  var formatted_response = {}
  formatted_response["status"]="success"
  formatted_response["message"]="payment request created"
  delete input_response.dataValues.user_id
  formatted_response["data"]=input_response
  resp.status(200).send(formatted_response)
}
exports.pre_process_update = async(req,resp)=>{
  var payment_data = await models.Payment.findOne({
    where: {
        id: req.body.payment_id
    }
  })
  var plan = await models.SubscriptionPlan.findOne({
    where: {
        id: payment_data.plan_id,
    }
  })
  var coach_resp = req.body.coach_resp
  var enrollment_data = await models.Enrollment.findOne({
    where: {
      user_id: payment_data.user_id,
      subscription_id: payment_data.plan_id,
      batch_id: plan.batch_id
    }
  })
  return {payment_data, enrollment_data, plan, coach_resp}
}
exports.process_update_input_req = async(req,input_response)=>{
  const {payment_data, enrollment_data, plan, coach_resp} = input_response;
  plan_duration = plan.duration
  enrollment_data.end_date = new Date().toJSON().slice(0,19).replace('T',' ');
  var new_end_date = addDays(enrollment_data.end_date, plan_duration)
  if(!coach_resp) {
    await models.Enrollment.update({status: "inactive"}, {where: {id: enrollment_data.id}})
    await models.Payment.update({status: "failed"}, {where: {id: payment_data.id}})
  } else {
    await models.Enrollment.update({status: "active", end_date:new_end_date}, {where: {id: enrollment_data.id}})
    await models.Payment.update({status: "success"}, {where: {id: payment_data.id}})
  }
  return {payment_id: payment_data.id, enrollment_id: enrollment_data.id, dataValues:req.body, coach_resp: coach_resp}
}

exports.post_update_process = async(req,resp,input_response)=>{
  var formatted_response = {}
  if(input_response.coach_resp) {
    formatted_response["status"]="success"
    formatted_response["message"]="payment success, enrollment created successfully"
  } else {
    formatted_response["status"]="rejected"
    formatted_response["message"]="payment rejected by coach, enrollment creation failed"
  }
  delete input_response.dataValues.user_id
  formatted_response["data"]=input_response
  resp.status(200).send(formatted_response)
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
exports.post_transaction_details_process = async(resp)=>{
  resp.status(200).send({status:"Success",data:transactions})
}