const { Coach, CoachImage } = require('../models');
const {uploadFile} = require('../lib/upload_files_s3')

exports.process_create_coach = async (req, resp) => {
    const {
        name, phone_number, email, status, sports_id, experience,
        verified, tier, awards, team_affiliations, about, profile_pic,
        locality, city, state, pincode
    } = req.body;

    if (phone_number == null) {
        return resp.status(400).send({ status: "Failure", details: "Phone Number Not Provided" })
    }
    const coach = await Coach.findOne({
        where: {
            phone_number: phone_number,
        }
    })
    if (coach) {
        return resp.status(409).send({ status: "Failure", details: "Phone Number Already Registed" })
    }
    const newCoach = await Coach.create({
        name, phone_number, email, status, sports_id, experience,
        verified, tier, awards, team_affiliations, about, profile_pic,
        locality, city, state, pincode
    })
    return resp.status(201).send({ status: "Success", coach: newCoach });
}


exports.process_image_upload_request = async (req, resp) => {
    if (req.files == null || req.files.image == null) {
      return resp.status(400).send("Image Not Provided")
    }
    if (req.query == null || req.query.coach_id == null){
      return resp.status(400).send("Coach ID Not Provided")
    }
    const image = req.files.image
    const coach_id = req.query.coach_id
  
    if (image instanceof Array) {
      await upload_multiple_images(image,coach_id)
    }else {
      await upload_and_create_data(image, coach_id)
    }
    return resp.status(201).send({status:"Success",Details:"Image Uploaded Successfully"})
  }
  
  async function upload_multiple_images(images, coach_id) {
    for(let image of images){
      await upload_and_create_data(image, coach_id)
    }
  }
  
  async function upload_and_create_data(image, coach_id) {
    let img_url = await uploadFile(image)
    await CoachImage.create({ coachId: coach_id, img_url: img_url})
  }
