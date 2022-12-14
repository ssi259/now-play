const { Coach, CoachImage, CoachDocument} = require('../models');
const {uploadFile} = require('../lib/upload_files_s3')
const Api400Error = require('../error/api400Error')
const {Op} = require('sequelize')
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


exports.pre_process_get_monthly_payments = async (req) => {
  return {coach_id:req.user.coach_id,month:req.query.month}
}

exports.process_get_monthly_payments = async (input_data) => {
  const { coach_id, month } = input_data
  const data = []
  const utc_year = new Date().getUTCFullYear()
  const payments = await models.Payment.findAll(
    {
      where: {
        status: "success",
        coach_id:coach_id,
        updatedAt: {
            [Op.between]: [new Date(Date.UTC(utc_year, month, 1)),new Date(Date.UTC(utc_year, parseInt(month) + 1, 1))],
        }
      },
    },
  )
  for (let payment of payments) {
    const plan = await models.SubscriptionPlan.findByPk(payment.dataValues.plan_id)
    const user = await models.User.findByPk(payment.dataValues.user_id)
    data.push({
      plan: plan,
      user: user,
      payment_mode: payment.dataValues.payment_mode,
      payment_date: payment.dataValues.updatedAt
    })
  }
  return data
}

exports.post_process_get_monthly_payments = async (data, resp) => {
  resp.status(200).send({ status: "success", message: "retreived data successfully", data })
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
    payment_data_list.push({
      user: user,
      plan: plan,
      batch_id: payment.dataValues.batch_id,
      price: payment.dataValues.price,
      payment_mode: payment.dataValues.payment_mode,
    })
  }
  const result = (groupBy(payment_data_list, 'batch_id'));
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

async function batch_detials_fun(batch_id) {
  const batch_data = await models.Batch.findByPk(batch_id)
  const arena_details = await models.Arena.findByPk(batch_data.dataValues.arena_id)
  const academy_details = await models.Academy.findByPk(batch_data.dataValues.academy_id)
  const sports_details = await models.Sports.findByPk(batch_data.dataValues.sports_id)
  
  const arena_data = arena_details != null ? { "name": arena_details["name"], "lat": arena_details["lat"], "lng": arena_details["lng"], "city": arena_details["city"], "locality": arena_details["locality"], "state": arena_details["state"] } : null
  const academy_data = academy_details != null ? { "name": academy_details["name"] } : null
  const sports_data = sports_details != null ? { "id": sports_details["id"], "name": sports_details["name"], "type": sports_details["type"] } : null
  
  const obj = {
    "id": batch_data.dataValues["id"],
    "arena_id": batch_data.dataValues["arena_id"],
    "coach_id": batch_data.dataValues["coach_id"],
    "academy_id": batch_data.dataValues["academy_id"],
    "sports_id": batch_data.dataValues["sports_id"],
    "days": batch_data.dataValues["days"],
    "thumbnail_img":batch_data.dataValues.thumbnail_img,
    "banner_img":batch_data.dataValues.banner_img,
    "start_time": batch_data.dataValues["start_time"],
    "end_time": batch_data.dataValues["end_time"],
    "arena_data": arena_data,
    "academy_data": academy_data,
    "sports_data": sports_data
  }
  return obj
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
  resp.status(200).send({status:"success",message:"data retrieved successfully",data:student_enrollled})
}

exports.pre_process_get_enrolled_users_list = async (req) => {
  return {"coach_id":req.user.coach_id}
}

exports.process_get_enrolled_users_list = async (input_data) => {
  const { coach_id } = input_data
  const enrolled_users_data = []
  const enrollments = await models.Enrollment.findAll({
    where: {
      coach_id: coach_id,
      status: 'active'
    },
    attributes:['user_id','subscription_id','batch_id'],
  })  
  for (let enrollment of enrollments) {
    const user = await models.User.findByPk(enrollment.dataValues.user_id)
    const plan = await models.SubscriptionPlan.findByPk(enrollment.dataValues.subscription_id)
    enrolled_users_data.push({
      user: user,
      plan:plan,
      batch_id: enrollment.dataValues.batch_id,
    })
  }
  const result = (groupBy(enrolled_users_data, 'batch_id'));
  return result
}

exports.post_process_get_enrolled_users_list = async (resp, data) => {
  const data_resp = []
  for (const batch_id in data) {
    data_resp.push({
      batch_details: await batch_detials_fun(batch_id),
      enrolled_users:data[batch_id]
    })
  }
  resp.status(200).send({status:"success",message:"data retrieved successfully", data:data_resp})
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
}

exports.pre_process_get_batch_details = async (req) => {
  return {batch_id:req.params.id, coach_id:req.user.coach_id }
}

exports.process_get_batch_details = async (input_data) => {
  const { batch_id, coach_id } = input_data
  const batch = await batch_detials_fun(batch_id)
  const enrollments = await models.Enrollment.findAll({ where: { batch_id: batch_id, status: 'active' }, attributes: ['user_id', 'subscription_id'] })
  const enrolled_players = await Promise.all(enrollments.map(async (enrollment) => {
    return {
      user: await models.User.findByPk(enrollment['user_id']),
      plan: await models.SubscriptionPlan.findByPk(enrollment['subscription_id']),
    }
  }))
  batch.enrolled_players = enrolled_players

  const reviews = await models.Review.findAll({ where:coach_id }) 
  const reviews_list = []
  for(let review of reviews){
    const user = await models.User.findOne({where:{id: review['user_id']}})
    const review_data = {
      review_text: review['review_text'],
      review_time: review['createdAt'],
      review_rating: review['rating'],
      reviewer_name: user['name'],
      reviewer_profile_pic : user['profilePic']
    }
    reviews_list.push(review_data)
  }
  batch.reviews = reviews_list

  const ratings_sum =  reviews.reduce((total , review) => {
    return total + review['rating']
  }, 0)
  batch.rating = {
    rating_count: reviews.length,
    average_rating: ratings_sum / reviews.length
  };

  return batch
}

exports.post_process_get_batch_details = async (data, resp) => {
  resp.status(200).send({ status: "success", message: "batch data retrieved successfully ", data: data })
}