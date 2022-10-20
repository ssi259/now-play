const models = require("../models");
const {uploadFile} = require('../lib/upload_files_s3')

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

exports.process_image_upload_request = async (req, resp) => {
    if (req.files == null || req.files.image == null) {
      return resp.status(400).send("Image Not Provided")
    }
    if (req.query == null || req.query.academy_id == null){
      return resp.status(400).send("Academy ID Not Provided")
    }
    const image = req.files.image
    const academy_id = req.query.academy_id
  
    if (image instanceof Array) {
      await upload_multiple_images(image,academy_id)
    }else {
      await upload_and_create_data(image, academy_id)
    }
    return resp.status(201).send({status:"Success",Details:"Image Uploaded Successfully"})
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