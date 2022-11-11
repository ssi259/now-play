const { uploadFile }= require('../lib/upload_files_s3');
const models = require("../models");
const {ArenaImage} = require('../models')
const Api400Error = require('../error/api400Error')
const Api500Error = require('../error/api500Error')


exports.pre_process_create_arena = async(req,resp)=>{
  await  models.Arena.create({name: req.body.name,phone_number: req.body.phone_number,email: req.body.email,city: req.body.city,state: req.body.state,pincode: req.body.pincode,country: req.body.country,lat: req.body.lat,lng: req.body.lng}).then(function (arena) {
      if (arena) {
          return arena;
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
          return arena_details;
      } else {
        throw new Api500Error(`Bad Request`)
      }
}
exports.process_arena_details_input_req = async(input_response)=>{
  return input_response
}
exports.post_arena_details_process = async(req,resp,input_response)=>{
  resp.send(input_response)
}


exports.pre_process_arenas_detail = async(req,resp)=>{
  const arenas_detail = await  models.Arena.findOne({where: {id:req.params.id}})
      if (arenas_detail) {
          resp.send(arenas_detail);
      } else {
        throw new Api400Error('Error in finding arena_detail');
      }
}
exports.process_arenas_detail_input_req = async(input_response)=>{
  return input_response
}
exports.post_arenas_detail_process = async(req,resp,input_response)=>{
  resp.send(input_response)
}

exports.pre_process_update_arena_by_id = async (req) => {
  return {arena_id:req.params.id, data:req.body}
}

exports.process_update_arena_by_id = async (input_data) => {
  const { arena_id, data } = input_data
  const [affected_rows] = await models.Arena.update(data, {
    where: {
        id:arena_id
    },
  })
  if (!affected_rows) {
    throw new Api400Error("invalid request")
  }
}

exports.post_process_update_arena_by_id = async (resp) => {
  resp.status(200).send({status:"success",message:"arena updated successfully"})
}