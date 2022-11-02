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
  resp.send(input_response)
}