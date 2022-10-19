const dbConfig = require("../config/db_config.js");
const models = require("../models");

exports.pre_process_create_sport = async(req,resp)=>{
  const result = await  models.Sports.create({name: req.body.name,type: req.body.type,thumbnail: req.body.thumbnail,about: req.body.about}).then(function (sport) {
      if (sport) {
          resp.send(sport);
      } else {
          resp.status(400).send('Error in insert new sport');
      }
  });
}
exports.process_sport_input_req = async(input_response)=>{
  return input_response
}
exports.post_sport_process = async(req,resp,input_response)=>{
  resp.send(input_response)
}
exports.post_create_sport_process = async(req,resp,input_response)=>{
    resp.send(input_response)
}

exports.pre_process_sports_list = async(req,resp)=>{
  const sports_list = await models.Sports.findAll();
      if (sports_list) {
          return sports_list
      } else {
          resp.status(400).send('list not found');
      }
}   
exports.process_sports_list_input_req = async(input_response)=>{
  return input_response
}
exports.post_sports_list_process = async(req,resp,input_response)=>{
  resp.send(input_response)
}
