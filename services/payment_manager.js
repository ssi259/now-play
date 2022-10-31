const models = require("../models");
const Api500Error = require('../error/api500Error')


exports.pre_process_create_payment = async(req,resp)=>{
  const result = await  models.Payment.create({plan_id: req.body.plan_id,price: req.body.price,status: req.body.status,user_id: req.body.user_id}).then(function (payment) {
      if (payment) {
          resp.send(payment);
      } else {
        throw new Api500Error(`Error In Making Payment`)
      }
  });
}
exports.process_payment_input_req = async(input_response)=>{
  return input_response
}
exports.post_payment_process = async(req,resp,input_response)=>{
  resp.send(input_response)
}
