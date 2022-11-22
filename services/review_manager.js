const dbConfig = require("../config/db_config.js");
const models = require("../models");
const Api400Error = require('../error/api400Error')


exports.pre_process_create_review = async(req,resp)=>{
  const result = await  models.Review.create({rating: req.body.rating,coach_id: req.body.coach_id,user_id: req.body.user_id,review_text: req.body.review_text,type: req.body.type}).then(function (review) {
      if (review) {
          resp.send(review);
      } else {
          resp.status(400).send('Error in inserting new review');
      }
  });
}
exports.process_review_input_req = async(input_response)=>{
  return input_response
}
exports.post_review_process = async(req,resp,input_response)=>{
  resp.send(input_response)
}

exports.pre_process_check_eligibility = async(req,resp)=>{
  if(req.query.coach_id == undefined){
    throw new Api400Error("Coach ID Not Provided")
  }
  return {"coach_id":req.query.coach_id,"user_id":req.user.user_id}
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
  resp.status(200).send({ status: "success", data: result })
}


  

