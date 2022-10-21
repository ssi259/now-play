const models = require("../models");
const {uploadFile} = require('../lib/upload_files_s3')
const Api400Error = require('../error/api400Error')
const Api500Error = require('../error/api500Error')
exports.pre_process_create_sport = async(req,resp)=>{
  const result = await  models.Sports.create({name: req.body.name,type: req.body.type,thumbnail: req.body.thumbnail,about: req.body.about}).then(function (sport) {
      if (sport) {
          resp.send(sport);
      } else {
        throw new Api500Error(`Error In Creating Sports`)
      }
  });
}
exports.process_sport_input_req = async(input_response)=>{
  return input_response
}
exports.post_sport_process = async(req,resp,input_response)=>{
  resp.send(input_response)
}
exports.pre_process_sports_list = async(req,resp)=>{
  const sports_list = await models.Sports.findAll();
      if (sports_list) {
          return sports_list
      } else {
        throw new Api400Error(`Error In Showing Sports List`)
      }
}   
exports.process_sports_list_input_req = async(input_response)=>{
  return input_response
}
exports.post_sports_list_process = async(req,resp,input_response)=>{
  resp.send(input_response)
}


exports.pre_process_image_upload_request = async(req) => {
  if (req.files == null || req.files.image == null) {
    throw new Api400Error('Image Not Provided')
  }
  if (req.query == null || req.query.sport_id == null) {
    throw new Api400Error('Sport ID Not Provided')
  }
  return req
}

exports.process_image_upload_request = async (req) => {
  const image = req.files.image
  const sport_id = req.query.sport_id
  if (image instanceof Array) {
    await upload_multiple_images(image,sport_id)
  }else {
    await upload_and_create_data(image, sport_id)
  }
}

exports.post_process_image_upload_request = async (resp) => {
  resp.status(201).send({status:"Success",message:"Image Uploaded Successfully"})
}

async function upload_multiple_images(images, sport_id) {
  for(let image of images){
    await upload_and_create_data(image, sport_id)
  }
}

async function upload_and_create_data(image, sport_id) {
  let img_url = await uploadFile(image)
  await models.SportImage.create({ sportId: sport_id, img_url: img_url})
}
exports.pre_process_sport_list = async(req,resp)=>{
  const sport_list = await models.Sports.findOne({where: {id:req.params.id}})
      if (sport_list) {
          return sport_list
      } else {
        throw new Api400Error(`Error In Showing Sports List`)
      }
}   
exports.process_sport_list_input_req = async(input_response)=>{
  return input_response
}
exports.post_sport_list_process = async(req,resp,input_response)=>{
  resp.send(input_response)
}


