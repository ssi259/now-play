const { Coach, CoachImage, CoachDocument, Payment, User, SubscriptionPlan, Batch } = require('../models');
const {uploadFile} = require('../lib/upload_files_s3')
const Api400Error = require('../error/api400Error')
const models = require('../models');

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

exports.post_process_get_coach_batches = async (resp, batches) => {
  resp.status(200).send({ status: "Success", data: batches })
}

exports.pre_process_get_payments_by_status = async (req) => {
  return { coach_id: req.user.coach_id, status: req.query.status }
}

exports.process_get_payments_by_status = async (input_data) => {
  const { coach_id, status } = input_data
  const payment_data_list= []
  const payments = await models.Payment.findAll({
    where: {
      coach_id: coach_id,
      status : status
    }
  })
  for (let payment of payments) {
    const user = await models.User.findByPk(payment.dataValues.user_id)
    const plan = await models.SubscriptionPlan.findByPk(payment.dataValues.plan_id)
    const batch = plan != null ? await models.Batch.findByPk(plan.batch_id) : null
    payment_data_list.push({
      user: user,
      plan: plan,
      batch: batch.id,
      price: payment.dataValues.price,
      payment_mode: payment.dataValues.payment_mode,
    })
  }
  const result = (groupBy(payment_data_list, 'batch'));
  return result
}

const groupBy = async function (xs,key) {
  return xs.reduce((rv, x)=> {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
}

exports.post_process_get_payments_by_status = async (data, resp) => {
  const data_resp = []
  for (const batch_id in data) {
    data_resp.push({
      batch_details: await batch_detials_fun(batch_id),
      payments:data[batch_id]
    })
  }
  resp.status(200).send({status:"success",message:"data retrieved successfully", data:data_resp})
}

async function  batch_detials_fun(batch_id) {
  const batch_data = await models.Batch.findByPk(batch_id)
  const arena_details = await models.Arena.findByPk(batch_data.dataValues.arena_id)
  const academy_details = await models.Academy.findByPk(batch_data.dataValues.academy_id)
  const sports_details = await models.Sports.findByPk(batch_data.dataValues.sports_id)
  
  const arena_data = arena_details != null ? { "name": arena_details["name"], "lat": arena_details["lat"], "lng": arena_details["lng"], "city":arena_details["city"],"locality":arena_details["locality"],"state":arena_details["state"] } : null
  const academy_data = academy_details != null ?  { "name": academy_details["name"]} : null
  const sports_data = sports_details !=null ? {"id":sports_details["id"],"name":sports_details["name"],"type":sports_details["type"]} : null
  
  const obj = {
              "id": batch_data.dataValues["id"],
              "arena_id": batch_data.dataValues["arena_id"],
              "coach_id": batch_data.dataValues["coach_id"],
              "academy_id": batch_data.dataValues["academy_id"],
              "sports_id": batch_data.dataValues["sports_id"],
              "days": batch_data.dataValues["days"],
              "start_time": batch_data.dataValues["start_time"],
              "end_time": batch_data.dataValues["end_time"],
              "arena_data":arena_data,
              "academy_data":academy_data,
              "sports_data": sports_data
  }
  return obj
}