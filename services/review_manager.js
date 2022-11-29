const dbConfig = require("../config/db_config.js");
const models = require("../models");
const Api400Error = require('../error/api400Error')


exports.pre_process_create_review = async(req,resp)=>{
  if(req.body.coach_id == undefined){
    throw new Api400Error("Coach ID Not Provided")
  }
  return {"user_id":req.user.user_id,"coach_id":req.body.coach_id,"rating":req.body.rating,"review_text":req.body.review_text,"type":req.body.type}
}
exports.process_review_input_req = async(input_response)=>{
  const review_exists = await models.Review.update(
    { rating: input_response.rating, review_text: input_response.review_text },
    {
      where: {
        user_id: input_response.user_id,
        coach_id: input_response.coach_id,
      },
    }
  )
  if (review_exists[0] == 0) {
    return await models.Review.create(input_response);
  }
  else {
    return {"message":"Review Updated"}
  }
}

exports.post_review_process = async(req,resp,input_response)=>{
  resp.status(200).send({ status: "success", data: input_response })
}

exports.pre_process_check_eligibility = async(req,resp)=>{
  if(req.query.coach_id == undefined){
    throw new Api400Error("Coach ID Not Provided")
  }
  return {"coach_id":(+req.query.coach_id),"user_id":req.user.user_id}
}

exports.process_check_eligibility_input_req = async(input_response)=>{
  const eligible = await models.Enrollment.findOne({ where: { 
    coach_id: input_response.coach_id,
    user_id:input_response.user_id 
  }});
  if (eligible) {
      return ({"eligibility":true});
  }
  else {
      return ({"eligibility":false});
  }
}

exports.post_process_check_eligibility = async(req,resp,result)=>{
  resp.status(200).send({ status: "success", data: result,message: "user is eligible to review coach" })
}


exports.pre_process_get_user_reviews = async(req,resp)=>{
  if(req.query.coach_id == null){
    throw new Api400Error("Coach ID Not Provided")
  }
  return {"coach_id":req.query.coach_id,"user_id":req.user.user_id}
}

exports.process_get_user_reviews = async (input_response) => {
  const {coach_id, user_id} = input_response
  const review = await models.Review.findAll({ where: { 
    coach_id: coach_id,
    user_id:user_id 
  }});
  return review
}

exports.post_process_get_user_reviews = async(data,resp)=>{
  resp.status(200).send({ status: "success", data: data })
}

