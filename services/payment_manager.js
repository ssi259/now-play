const models = require("../models");
const Api500Error = require('../error/api500Error')


exports.pre_process_create = async(req,resp)=>{
  const result = await  models.Payment.create({plan_id: req.body.plan_id,price: req.body.price,status: req.body.status,user_id: req.body.user_id})
  return result
}
exports.process_create_input_req = async(input_response)=>{
  return input_response
}
exports.post_create_process = async(req,resp,input_response)=>{
  resp.status(200).send(input_response)
}
exports.pre_process_update_payment = async(req,resp)=>{
  return {payment_id:req.params.id, data: req.body}
}
exports.process_update_input_req = async(req,resp)=>{
  const {payment_id , data } = input_data
  const [affected_rows] = await Coach.update(data, {
    where: {
      id:id
    }
  })
  if (!affected_rows) {
    throw new Api400Error("invalid request")
  }

}