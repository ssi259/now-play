const models = require("../models");
const {uploadFile} = require('../lib/upload_files_s3')

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


exports.process_image_upload_request = async (req, resp) => {
  if (req.files == null || req.files.image == null) {
    return resp.status(400).send("Image Not Provided")
  }
  if (req.query == null || req.query.sport_id == null){
    return resp.status(400).send("Sport ID Not Provided")
  }
  const image = req.files.image
  const sport_id = req.query.sport_id

  if (image instanceof Array) {
    await upload_multiple_images(image,sport_id)
  }else {
    await upload_and_create_data(image, sport_id)
  }
  return resp.status(201).send({status:"Success",Details:"Image Uploaded Successfully"})
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