const { uploadFile }= require('../lib/upload_files_s3');
const models = require("../models");
const {ArenaImage} = require('../models')


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

exports.pre_process_image_upload_request = async (req, resp) => {
  if (req.files == null || req.files.image == null) {
    resp.status(400).send("Image Not Provided")
  }
  if (req.query == null || req.query.arena_id == null){
    resp.status(400).send("Arena ID Not Provided")
  }
  return req
}
exports.process_image_upload_request = async (req, resp) => {
  const image = req.files.image
  const arena_id = req.query.arena_id
  if (!(image instanceof Array)) {
    await upload_and_create_data(image, arena_id)
  }else {
    await upload_multiple_images(image,arena_id)
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