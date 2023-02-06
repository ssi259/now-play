const models = require("../models");
const Api500Error = require('../error/api500Error')
const create_send_notification = require('../utilities/Notification/create_send_notification')

function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
exports.pre_process_create = async (req) => {
  const {batch_id, plan_id, coach_id} = req.body
  return {user_id: req.user.user_id, batch_id, plan_id, coach_id}
}
exports.process_create_input_req = async(input_response)=>{
  const {user_id, batch_id, plan_id, coach_id} = input_response;
  const plan = await models.SubscriptionPlan.findByPk(plan_id)
  var enrollent_type = plan.price==0?"free":"paid";
  await models.Enrollment.update({status: "inactive"}, {where: {user_id, batch_id, status: "pending"}})
  await models.Payment.update({status: "failed"}, {where: {user_id , coach_id , batch_id,status: "pending"}})
  const payment = await models.Payment.create({plan_id,status: "pending",batch_id, user_id, coach_id, price: plan['price'], payment_mode: "Cash"})
  await models.Enrollment.create({ batch_id, user_id, subscription_id: plan_id, status: "pending", type: enrollent_type, coach_id })
  await create_send_notification.new_enrollment({ user_id, batch_id, plan_id, coach_id, payment_id: payment['id'] })
  return {user_id, dataValues: { batch_id, plan_id, coach_id }, price: plan['price'] }
}
exports.post_create_process = async(resp,input_response)=>{
  resp.status(200).send({status:"success",message:"payment request created", data:input_response})
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
  if(coach_resp == false) {
    await models.Enrollment.update({status: "inactive"}, {where: {id: enrollment_data.id}})
    await models.Payment.update({status: "failed"}, {where: {id: payment_data.id}})
  } else {
    await models.Enrollment.update({status: "active", end_date:new_end_date}, {where: {id: enrollment_data.id}})
    await models.Payment.update({status: "success"}, {where: {id: payment_data.id}})
  }
  await mark_notification_read(payment_data.id)
  await create_send_notification.payment_status({enrollment_id: enrollment_data['id'], payment_id:payment_data['id'], coach_resp})
  return {payment_id: payment_data.id, enrollment_id: enrollment_data.id, dataValues:req.body, coach_resp: coach_resp}
}

async function mark_notification_read(payment_id) {
  await models.Notification.update({is_read:true},{
    where: {
      payment_id
    }
  })
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

exports.pre_process_all_payments = async(req,resp)=>{
  return {}
}

exports.process_all_payments_input_req = async(input_response)=>{
  let all_payments = await models.Payment.findAll()
  all_payments = Promise.all(all_payments.map(async (payment) => {
    payment = payment.toJSON();
    [payment.user_name,payment.user_phone] = await models.User.findOne({where: {id: payment.user_id}}).then((user)=>{return [user.name,user.phoneNumber]});
    [payment.coach_name,payment.coach_phone] = await models.Coach.findOne({where: {id: payment.coach_id}}).then((coach)=>{return [coach.name,coach.phone_number]});
    payment.plan_name = await models.SubscriptionPlan.findOne({where: {id: payment.plan_id}}).then((plan)=>{return plan.plan_name})
    return payment
  }))
  if(!all_payments) throw new Error("No payments found").status(204)
  return all_payments
}

exports.post_all_payments_process = async(resp,input_response)=>{
  resp.status(200).send({status:"Success",data:input_response})
}