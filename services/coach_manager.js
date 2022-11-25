const { Coach, CoachImage, CoachDocument, Payment, SubscriptionPlan, Batch, User} = require('../models');
const {uploadFile} = require('../lib/upload_files_s3')
const Api400Error = require('../error/api400Error')
const {Op} = require('sequelize')

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


exports.pre_process_get_monthly_payments = async (req) => {
  return {coach_id:req.params.id,month:req.query.month}
}

exports.process_get_monthly_payments = async (input_data) => {
  const { coach_id, month } = input_data
  const data = []
  const next_month = parseInt(month) + 1
  const utc_year = new Date().getUTCFullYear()
  const month_first_day = new Date(Date.UTC(utc_year, month, 1))
  const next_month_first_day = new Date(Date.UTC(utc_year, next_month, 1)) 
  const payments = await Payment.findAll(
    {
      where: {
        status: "success",
        coach_id:coach_id,
        updatedAt: {
            [Op.strictLeft]: [month_first_day,next_month_first_day],
        }
      },
    },
  )
  for (let payment of payments) {
    const plan = await SubscriptionPlan.findByPk(payment.dataValues.plan_id)
    const user = await User.findByPk(payment.dataValues.user_id)
    data.push({
      plan: plan!=null ? {
        name: plan.plan_name,
        price: plan.price,
        duration:plan.duration
      }: null,
      user: user!=null ? {
        name: user.name,
        phone_number: user.phoneNumber
      }:null,
      payment_mode: payment.dataValues.payment_mode,
      payment_date: payment.dataValues.updatedAt
    })
  }
  return data
}

exports.post_process_get_monthly_payments = async (data, resp) => {
  resp.status(200).send({status:"success",message:"retreived data successfully", data})
}