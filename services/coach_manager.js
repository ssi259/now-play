const { Coach, CoachImage, CoachDocument } = require('../models');
const {uploadFile} = require('../lib/upload_files_s3')
const Api400Error = require('../error/api400Error')
const models = require('../models');
const sequelize = require('sequelize')

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

exports.pre_process_image_upload_request = async (req) => {
  if (req.files == null || req.files.image == null) {
      throw new Api400Error("Image Not Provided")
  }
  if (req.query == null || req.query.coach_id == null){
    throw new Api400Error("Coach ID Not Provided")
  }
  return req
}

exports.process_image_upload_request = async (req) => {
    const image = req.files.image
    const coach_id = req.query.coach_id
    if (image instanceof Array) {
      await upload_multiple_images(image,coach_id)
    }else {
      await upload_and_create_data(image, coach_id)
    }
}
  
exports.post_process_image_upload_request = async (resp) => {
  resp.status(201).send({status:"Success",message:"Image Uploaded Successfully"})
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

exports.pre_process_document_upload_request = async (req) => {
  if (req.files == null || req.files.document == null) {
    throw new Api400Error("Document Not Provided")
  }
  if (req.query == null || req.query.coach_id == null){
    throw new Api400Error("Coach ID Not Provided")
  }
  if (req.query == null || req.query.document_type == null){
    throw new Api400Error("Document Type Not Provided")
  }
  return req
}

exports.process_document_upload_request = async (req) => {
    const document = req.files.document
    const coach_id = req.query.coach_id
    const document_type = req.query.document_type
    if (document instanceof Array) {
      await upload_multiple_documents(document,coach_id,document_type)
    }else {
      await upload_and_create_document_data(document, coach_id,document_type)
    }
}

exports.post_process_document_upload_request = async (resp) => {
  resp.status(201).send({status:"Success",message:"Document Uploaded Successfully"})
}

async function upload_multiple_documents(documents, coach_id,document_type) {
  for(let document of documents){
    await upload_and_create_document_data(document, coach_id,document_type)
  }
}

async function upload_and_create_document_data(document, coach_id,document_type) {
  let document_url = await uploadFile(document)
  await CoachDocument.create({ coachId: coach_id,document_url,document_type})
}


exports.process_get_coaches= async () => {
  const coaches = await Coach.findAll()
  return coaches;
}

exports.post_process_get_coaches = async ( coaches, resp) => {
  resp.status(200).send({status:"Success",data:coaches})
}

exports.pre_process_get_coach_by_id = (req) => {
  if (req.params == null || req.params.id == null) {
    throw new Api400Error("Coach ID Not Provided")
  }
  return req.params.id
}

exports.process_get_coach_by_id = async (coach_id) => {
  const coach = await Coach.findByPk(coach_id)
  if (!coach) {
    throw new Api400Error(`Bad Request`)
  }
  return coach;
}

exports.post_process_get_coach_by_id = async ( coach, resp) => {
  resp.status(200).send({status:"Success",data:coach})
}

exports.pre_process_update_coach_by_id = async (req) => {
  return {coach_id:req.params.id, data: req.body}
}

exports.process_update_coach_by_id = async (input_data) => {
  const {coach_id , data } = input_data
  const [affected_rows] = await Coach.update(data, {
    where: {
      id:coach_id
    }
  })
  if (!affected_rows) {
    throw new Api400Error("invalid request")
  }
}

exports.post_process_update_coach_by_id = async (resp) => {
  resp.status(200).send({status:"success",message:"coach updated successfully"})
}

exports.pre_process_get_coach_batches = async (req) => {
  return {"coach_id":req.user.coach_id}
}

exports.process_get_coach_batches = async (input_data) => {
  const {coach_id} = input_data
  const batches = await models.Batch.findAll({
    where: {
      coach_id: coach_id
    }
  })
  const coachBatches = await Promise.all(batches.map(async (batch) => {
    batch = batch.toJSON()
    batch.sports_name = await models.Sports.findByPk(batch.sports_id).then(sport => sport.name)
    batch.academy_name = await models.Academy.findByPk(batch.academy_id).then(academy => academy.name)
    batch.arena_name = await models.Arena.findByPk(batch.arena_id).then(arena => arena.name)
    batch.total_players = await models.Enrollment.count({ where: { batch_id: batch.id,status:'active' } })
    return batch
  }))
  return coachBatches
}

exports.post_process_get_coach_batches = async (resp,batches) => {
  resp.status(200).send({status:"Success",data:batches})
}

exports.pre_process_get_coach_enrolled_students = async (req) => {
  return {"coach_id":req.user.coach_id}
}

exports.process_get_coach_enrolled_students = async (input_data) => {
  const {coach_id} = input_data
  const student_enrolled = await models.Enrollment.findAll({
    where: {
      coach_id: coach_id,
      status: 'active'
    },
    group: ['user_id'],
  })
  return {"students_enrolled":student_enrolled.length};
}

exports.post_process_get_coach_enrolled_students = async (resp,student_enrollled) => {
  resp.status(200).send({status:"Success",data:student_enrollled})
}


exports.pre_process_update_profile_pic = async (req) => {
  if (req.files == null || req.files.image == null) {
      throw new Api400Error("Image Not Provided")
  }
  return {coach_id:req.user.coach_id,image:req.files.image }
}

exports.process_update_profile_pic = async (input_data) => {
  const { coach_id, image } = input_data
  const img_url = await uploadFile(image)
  await models.Coach.update({ profile_pic: img_url }, {
      where: {
          id:coach_id
      }
  })
  return {img_url}
}

exports.post_process_update_profile_pic = async (data,resp) => {
  resp.status(200).send({status:"success",message:"profile pic updated successfully ", data:data})
// coach earnings
exports.pre_process_get_coach_earnings = async (req) => {
  return {"coach_id":req.user.coach_id, "month":req.params.month, "year":req.params.year}
}

exports.process_get_coach_earnings = async (input_data) => {
  const {coach_id, month, year} = input_data
  if(month == 0 && year == 0){
    const total_earnings = await models.Payment.findAll({
     attributes: { 
         include: [[sequelize.fn("SUM", sequelize.col("price")), "lifetime"]]
     },
     where: {coach_id: coach_id, status: "success"}
    })
  return {"total_earnings":total_earnings};
}
  if(month !=0 && year !=0){
    const monthly_earning = await models.Payment.findAll({
     attributes: {
       include: [
         [sequelize.fn('SUM', sequelize.col('price')), 'earnings'],
       ]
     },
     where: {
        [sequelize.Op.and]: [
        sequelize.where(sequelize.fn('MONTH', sequelize.col('updatedAt')), month),
        sequelize.where(sequelize.fn('YEAR', sequelize.col('updatedAt')), year),
        ],
        coach_id: coach_id, status: "success"}})
  return {"monthly_earning" : monthly_earning}
}  
}

exports.post_process_get_coach_earnings = async (resp,student_enrollled) => {
  resp.status(200).send({status:"Success",data:student_enrollled})
}