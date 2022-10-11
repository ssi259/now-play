const dbConfig = require("../config/db_config.js");

const Sequelize = require("sequelize");
const models = require("../models");
const batch = require("../models/arena.js");
const { Router } = require("express");
const { router } = require("../app.js");
const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min
  }
});

exports.pre_process_create_arena = async(req,resp)=>{
  const result = await  models.Arena.create({name: req.body.name,phone: req.body.phone,email: req.body.email,address: req.body.address,city: req.body.city,state: req.body.state,pincode: req.body.pincode,country: req.body.country,lat: req.body.lat,long: req.body.long}).then(function (arena) {
      if (arena) {
          resp.send(arena);
      } else {
          resp.status(400).send('Error in insert new arena');
      }
  });
}
exports.process_arena_input_req = async(input_response)=>{
  return input_response
}
exports.post_process = async(req,resp,input_response)=>{
  resp.send(input_response)
}

