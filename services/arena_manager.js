const dbConfig = require("../config/db_config.js");

const Sequelize = require("sequelize");
const models = require("../models");
const batch = require("../models/arena.js");


exports.pre_process_create_arena = async(req,resp)=>{
  const result = await  models.Arena.create({name: req.body.name,phone_number: req.body.phone_number,email: req.body.email,city: req.body.city,state: req.body.state,pincode: req.body.pincode,country: req.body.country,lat: req.body.lat,lng: req.body.lng}).then(function (arena) {
      if (arena) {
          resp.send(arena);
      } else {
          resp.status(200).send('Error in insert new arena');
      }
  });
}
exports.process_arena_input_req = async(input_response)=>{
  return input_response
}
exports.post_arena_process = async(req,resp,input_response)=>{
  resp.send(input_response)
}

