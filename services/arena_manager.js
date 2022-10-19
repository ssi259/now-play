const dbConfig = require("../config/db_config.js");
const { uploadFile }= require('../lib/upload_files_s3');

const Sequelize = require("sequelize");
const models = require("../models");
const batch = require("../models/arena.js");
const {ArenaFile} = require('../models')


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

exports.pre_process_file_upload_request = async (req, resp) => {
  if (req.files == null || req.files.file == null) {
    resp.status(400).send("Image Not Provided")
  }
  if (req.query == null || req.query.arena_id == null){
    resp.status(400).send("Arena ID Not Provided")
  }
  if (req.query == null || req.query.type == null){
    resp.status(400).send("type Not Provided")
  }
  return req
}
exports.process_file_upload_request = async (req, resp) => {
  const file = req.files.file
  const arena_id = req.query.arena_id
  const type = req.query.type

  if (!(file instanceof Array)) {
    var a = await upload_and_create_data(file, arena_id,type)
  }
  else {
    await upload_multiple_files(files,arena_id,type)
  }
  return resp.status(200).send({status:"Success",Details:"File Uploaded Successfully"})
}
async function upload_multiple_files(files, arena_id,type) {
  for(let file of files){
    await upload_and_create_data(file,arena_id,type)
  }
}
async function upload_and_create_data(file, arena_id,type) {
  let file_url = await uploadFile(file)
  const newArenaFile = await ArenaFile.create({ arenaId: arena_id, file_url: file_url, type: type, status:"active" })
}