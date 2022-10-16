const dbConfig = require("../config/db_config.js");
const models = require("../models");

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
