const models = require("../models");
const {uploadFile} = require('../lib/upload_files_s3')
const Api400Error = require('../error/api400Error')


exports.pre_process_create_academy = async(req,resp)=>{
  const result = await  models.Academy.create({name: req.body.name,phone_number: req.body.phone_number,email: req.body.email,sports_id: req.body.sports_id}).then(function (academy) {
    if (academy) {
        resp.send(academy);
    } else {
        resp.status(400).send('Error in creating new academy');
    }
  });
}
exports.process_create_academy_input_req = async(input_response)=>{
    return input_response
}
exports.post_create_academy_process = async(req,resp,input_response)=>{
    resp.send(input_response)
}


exports.pre_process_image_upload_request = async (req, res) => {
  if (req.files == null || req.files.image == null) {
    throw  new Api400Error('Image Not Provided')
  }
  if (req.query == null || req.query.academy_id == null){
    throw  new Api400Error('Academy ID Not Provided')
  }
  return req
}

exports.process_image_upload_request = async (req) => {
    const image = req.files.image
    const academy_id = req.query.academy_id
    if (image instanceof Array) {
      await upload_multiple_images(image,academy_id)
    }else {
      await upload_and_create_data(image, academy_id)
    }
}
  
exports.post_process_image_upload = async (resp) => {
  return resp.status(201).send({status:"Success",message:"Image Uploaded Successfully"})
} 
  
  async function upload_multiple_images(images, academy_id) {
    for(let image of images){
      await upload_and_create_data(image, academy_id)
    }
  }
  
  async function upload_and_create_data(image, academy_id) {
    let img_url = await uploadFile(image)
    await models.AcademyImage.create({ academyId: academy_id, img_url: img_url})
  }

exports.pre_process_academy_details = async(req,resp)=>{
  const academy_details = await models.Academy.findOne({where: {id:req.params.id}});
  if (academy_details) {
      return academy_details
  } else {
    throw new Api400Error(`BAD REQUEST`)
  }
}

exports.process_academy_details_input_req = async(input_response)=>{
  const sports_details = await models.Sports.findOne({where:{id:input_response["sports_id"]}})
  var sports_data = {"sports_name":sports_details["name"]}
  Object.assign(input_response.dataValues,sports_data);
  return input_response
}

exports.post_process_academy_details = async(req,resp,input_response)=>{
  resp.send(input_response)
}

exports.pre_process_academy_list = async(req,resp)=>{
  const academy_list = await models.Academy.findAll();
  if (academy_list) {
   return academy_list
  } else {
   throw new Api400Error(`BAD REQUEST`)
  }
}

exports.process_academy_list_input_req = async(input_response)=>{
  for (each_input_response of input_response){
  var sports_details = await models.Sports.findOne({where:{id:each_input_response["sports_id"]}})
  var sports_data = {"sports_name":sports_details["name"]}
  Object.assign(each_input_response.dataValues,sports_data)
  Object.assign(input_response,each_input_response.dataValues)
  }
  return input_response
}

exports.post_academy_list_process = async(req,resp,input_response)=>{
  resp.send(input_response)
}

exports.pre_process_update_academy = async(req,resp)=>{
  const update_academy = await  models.Academy.update(req.body, {where: {id:req.params.id}})
  .then(() => {return models.Academy.findOne({where: {id:req.params.id}})})
  .then(function (update_academy) {
      if (update_academy) {
          resp.send(update_academy);
      } else {
          resp.status(400).send('Error in Updating academy');
      }
  });
}
exports.process_update_academy_input_req = async(input_response)=>{
  return input_response
}
exports.post_update_academy_process = async(req,resp,input_response)=>{
  resp.send(input_response)
}
