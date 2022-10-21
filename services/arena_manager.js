const { uploadFile }= require('../lib/upload_files_s3');
const models = require("../models");
const {ArenaImage} = require('../models')
const Api400Error = require('../error/api400Error')
const Api500Error = require('../error/api500Error')


exports.pre_process_create_arena = async(req,resp)=>{
  const result = await  models.Arena.create({name: req.body.name,phone_number: req.body.phone_number,email: req.body.email,city: req.body.city,state: req.body.state,pincode: req.body.pincode,country: req.body.country,lat: req.body.lat,lng: req.body.lng}).then(function (arena) {
      if (arena) {
          resp.send(arena);
      } else {
        throw new Api500Error(`Error In Creating Arena`)
      }
  });
}
exports.process_arena_input_req = async(input_response)=>{
  return input_response
}
exports.post_arena_process = async(req,resp,input_response)=>{
  resp.send(input_response)
}

exports.process_image_upload_request = async (req, resp) => {
  if (req.files == null || req.files.image == null) {
    return resp.status(400).send("Image Not Provided")
  }
  if (req.query == null || req.query.arena_id == null){
    return resp.status(400).send("Arena ID Not Provided")
  }
  const image = req.files.image
  const arena_id = req.query.arena_id

  if (image instanceof Array) {
    await upload_multiple_images(image,arena_id)
  }else {
    await upload_and_create_data(image, arena_id)
  }
  return resp.status(201).send({status:"Success",Details:"Image Uploaded Successfully"})
}

async function upload_multiple_images(images, arena_id) {
  for(let image of images){
    await upload_and_create_data(image, arena_id)
  }
}

async function upload_and_create_data(image, arena_id) {
  let img_url = await uploadFile(image)
  await ArenaImage.create({ arenaId: arena_id, img_url: img_url})
}

exports.pre_process_arena_details = async(req,resp)=>{
  const arena_details = await  models.Arena.findAll()
      if (arena_details) {
          resp.send(arena_details);
      } else {
        throw new Api400Error(`Bad Request`)
      }
}
exports.process_arena_details_input_req = async(input_response)=>{
  return input_response
}
exports.post_arena_details_process = async(req,resp,input_response)=>{
  resp.send(input_response)
}