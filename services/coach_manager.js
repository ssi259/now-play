const { Coach, CoachImage, CoachDocument} = require('../models');
const {uploadFile} = require('../lib/upload_files_s3')
const Api400Error = require('../error/api400Error')
const {Op} = require('sequelize')
const models = require('../models');
const sequelize = require('sequelize')
const {send_push_notifications} = require('../utilities/send_push_notifications')

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

exports.pre_process_get_coaches = async(req,resp)=>{
  if (req.query.type == "admin"){
    const coaches = await Coach.findAll()
    return coaches
  }
  else { const coaches = await Coach.findAll({where:{status:"active"}})
    return coaches  
  }

}

exports.process_get_coaches_input_req= async (input_reponse) => {
  const coaches = input_reponse
  let awards = []
  let team_affiliations = []
  for (each_coach of coaches) {
    if (each_coach.awards){
      awards = each_coach.awards.replace(/[^a-zA-Z, ]/g, "").split(",");
      team_affiliations = each_coach.team_affiliations.replace(/[^a-zA-Z, ]/g, "").split(",");
    }
    delete each_coach["awards"];
    delete each_coach["team_affiliations"];
    each_coach["awards"] = awards
    each_coach["team_affiliations"] = team_affiliations
  }
  return coaches;
}

exports.post_get_coaches_process = async (  resp, process_response) => {
  resp.status(200).send({status:"Success",data:process_response})
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
  let awards = []
  let team_affiliations = []
  if (coach.awards){
    awards = coach.awards.replace(/[^a-zA-Z, ]/g, "").split(",");
    team_affiliations = coach.team_affiliations.replace(/[^a-zA-Z, ]/g, "").split(",");
  }
  delete coach["awards"];
  delete coach["team_affiliations"];
  coach["awards"] = awards
  coach["team_affiliations"] = team_affiliations
  
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
      coach_id: coach_id,
      status: 'active'
    }
  })
  
  const reviews = await models.Review.findAll({ where: {coach_id: coach_id} })
  const ratings_sum =  reviews.reduce((total , review) => {
    return total + review['rating']
  }, 0)

  const coachBatches = await Promise.all(batches.map(async (batch) => {
    batch = batch.toJSON()
    batch.sport_data = await models.Sports.findByPk(batch.sports_id).then(sport => sport.name)
    batch.academy_data = await models.Academy.findByPk(batch.academy_id).then(academy => academy.name)
    const arena_details = await models.Arena.findByPk(batch.arena_id)
    batch.arena_data = { "name": arena_details["name"], "lat": arena_details["lat"], "lng": arena_details["lng"], "city": arena_details["city"], "locality": arena_details["locality"], "state": arena_details["state"] }
    batch.rating = {
      rating_count: reviews.length,
      average_rating: ratings_sum / reviews.length
    };
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
  const coach_batches = await models.Batch.findAll({
    where: {
      coach_id: coach_id,
      status : 'active'
    }
  })
  const data_response =  await Promise.all(coach_batches.map(async (batch) => {
    const batch_data = await batch_detials_fun(batch.id)
    if (status == 'upcoming') {
      const seven_days_after = await date_with_days_gap(7)
      const seven_days_ago = await date_with_days_gap(-7)
      const enrollments = await models.Enrollment.findAll({
        where: {
          batch_id: batch.id,
          status: 'active',
          end_date: {
            [Op.between]:[seven_days_ago , seven_days_after]
          }
        }
      })
      if(enrollments.length == 0 ) return null
      batch_data.payments = await collection_detail(enrollments , status)
    }
    else {
      const payments = await models.Payment.findAll({
        where: {
          batch_id: batch.id,
          status: status
        }
      })
      if(payments.length == 0) return null
      batch_data.payments = await collection_detail(payments , status)
    }
    return batch_data
  }))
  return await data_response.filter(item => item != null)
}

async function date_with_days_gap(days) {
  const date = new Date(Date.now() + days * 24 * 60 * 60 * 1000)
  return date.toISOString().substring(0, 10) + " 00:00:00";
}

async function collection_detail(collection, status) {
  return await Promise.all(collection.map(async (element) => { 
    const user = await models.User.findByPk(element.user_id)
    const plan_id = status == 'upcoming' ? element.subscription_id : element.plan_id 
    const plan = await models.SubscriptionPlan.findByPk(plan_id)
    let start_date = null;
    let end_date = null
    if (status == 'pending') {
      start_date = new Date(element['createdAt'])
    } 
    else if (status == 'success') {
      start_date = new Date(element.updatedAt)
      let date = new Date(element['updatedAt'])
      end_date = new Date(date.setDate(date.getDate() + plan['duration']))
    }
    else {
      start_date = new Date(element['updatedAt'])
      end_date = new Date(element['end_date'])
    }
    return {
      id:element['id'],
      user: {
        id:user['id'],
        name: user['name'],
        profilePic:user["profilePic"],
      },
      plan: {
        id:plan['id'],
        plan_name: plan['plan_name'],
        description: plan['description'],
        status: plan['status'],
        price: plan['price'],
        tag: plan['tag'],
        type: plan['type'],
        duration:plan['duration']
      },
      start_date,
      end_date
  }
  }))
}

const groupBy = async function (xs,key) {
  return xs.reduce((rv, x)=> {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
}

exports.post_process_get_payments_by_status = async (data, resp) => {
  resp.status(200).send({status:"success",message:"data retrieved successfully", data})
}

async function batch_detials_fun(batch_id) {
  const batch_data = await models.Batch.findByPk(batch_id)
  const arena_details = await models.Arena.findByPk(batch_data.dataValues.arena_id)
  const academy_details = await models.Academy.findByPk(batch_data.dataValues.academy_id)
  const sports_details = await models.Sports.findByPk(batch_data.dataValues.sports_id)
  
  const arena_data = arena_details != null ? { "name": arena_details["name"], "lat": arena_details["lat"], "lng": arena_details["lng"], "city": arena_details["city"], "locality": arena_details["locality"], "state": arena_details["state"] } : null
  const academy_data = academy_details != null ? { "name": academy_details["name"] } : null
  const sports_data = sports_details != null ? { "id": sports_details["id"], "name": sports_details["name"], "type": sports_details["type"] } : null
  
  const batch_pics = await models.BatchPhotos.findAll({where: {batchId:batch_id}})
  const  batch_images = []
  for (pic of batch_pics){
    batch_images.push(pic.dataValues.img_url)
  }

  const data = {
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
    "sports_data": sports_data,
    "img_list":batch_images
  }
  return data
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

  const payments = await models.Payment.findAll({
    attributes: [[sequelize.fn('SUM', sequelize.col('price')), 'pending_payments_total']],
    where: {
      coach_id,
      status:"pending"
    }
  })

  let date = new Date();
 let dateString = date.toISOString().slice(0,10);
 const [year, month, day] = dateString.split('-');
  const enrollment_count = await models.Enrollment.count({
    where: {
      coach_id: coach_id,
      status: {
        [Op.or]: ["active", "pending"]
      },
      [sequelize.Op.and]: [
        sequelize.where(sequelize.fn('DAY', sequelize.col('createdAt')), day),
        sequelize.where(sequelize.fn('MONTH', sequelize.col('createdAt')), month),
        sequelize.where(sequelize.fn('YEAR', sequelize.col('createdAt')), year),
        
      ]
        
    }
  })
  return {"students_enrolled":student_enrolled.length , "pending_payments_total":payments[0].dataValues.pending_payments_total || 0 , "enrollment_count":enrollment_count};
}

exports.post_process_get_coach_enrolled_students = async (resp,data) => {
  resp.status(200).send({status:"success",message:"data retrieved successfully",data})
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
    const batch_details = await batch_detials_fun(batch_id)
    batch_details.enrolled_players = data[batch_id]
    data_resp.push(batch_details)
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
  const enrollments = await models.Enrollment.findAll({ where: { batch_id: batch_id, status: 'active' }, attributes: ['user_id', 'subscription_id','updatedAt','end_date'] })
  const enrolled_players = await Promise.all(enrollments.map(async (enrollment) => {
    return {
      user: await models.User.findByPk(enrollment['user_id']),
      plan: await models.SubscriptionPlan.findByPk(enrollment['subscription_id']),
      start_date: enrollment['updatedAt'],
      end_date: enrollment['end_date']
    }
  }))
  batch.enrolled_players = enrolled_players

  const reviews = await models.Review.findAll({ where:{coach_id: coach_id} }) 
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


exports.pre_process_get_coach_earnings = async (req) => {
  return {coach_id:req.user.coach_id, month:req.query.month, year:req.query.year}
}

exports.process_get_coach_earnings = async (input_data) => {
  const {coach_id, month, year} = input_data
  const total_earnings = await models.Payment.findAll({
    attributes:[[sequelize.fn("SUM", sequelize.col("price")), "lifetime"]],
    where: {coach_id: coach_id, status: "success"}
  })

  const monthly_earnings = await models.Payment.findAll({
    attributes: [[sequelize.fn('SUM', sequelize.col('price')), 'earnings']],
    where: {
      [sequelize.Op.and]: [
      sequelize.where(sequelize.fn('MONTH', sequelize.col('updatedAt')), month),
      sequelize.where(sequelize.fn('YEAR', sequelize.col('updatedAt')), year),
      ],
      coach_id: coach_id, status: "success"
    }
  })
  return {
    total_earnings: total_earnings[0].dataValues.lifetime != null ? total_earnings[0].dataValues.lifetime : 0 ,
    monthly_earnings: monthly_earnings[0].dataValues.earnings != null? monthly_earnings[0].dataValues.earnings : 0
  }
}

exports.post_process_get_coach_earnings = async (resp,data) => {
  resp.status(200).send({status:"success",message:"retrieved data successfully", data})
}

exports.pre_process_get_coach_details = async (req) => {
  return {coach_id:req.user.coach_id}
}

exports.process_get_coach_details = async (input_data) => {
  const {coach_id} = input_data
  const coach_details = await models.Coach.findOne({where:{id:coach_id}})
  if(coach_details == null){
    throw new Api404Error("coach not found")
  }
  let awards = []
  let team_affiliations = []
  if (coach_details.awards){
    awards = coach_details.awards.replace(/[^a-zA-Z, ]/g, "").split(",");
    team_affiliations = coach_details.team_affiliations.replace(/[^a-zA-Z, ]/g, "").split(",");
  }
  delete coach_details["awards"];
  delete coach_details["team_affiliations"];
  coach_details["awards"] = awards
  coach_details["team_affiliations"] = team_affiliations
  var sport = await models.Sports.findByPk(coach_details.sports_id)
  coach_details["sport_name"] = sport.name
  //find average rating for coach
  const reviews = await models.Review.findAll({where:{coach_id:coach_id}})
  let ratings_sum = 0
  for(let review of reviews){
    ratings_sum += review['rating']
  }
  coach_details["rating"] = {
    rating_count: reviews.length,
    average_rating: ratings_sum / reviews.length
  }
  return coach_details
}

exports.post_process_get_coach_details = async (resp,data) => {
  data.dataValues["rating"] = data["rating"]
  data.dataValues["sport_name"] = data["sport_name"]
  resp.status(200).send({status:"success",message:"retrieved data successfully", data})
}
exports.pre_process_get_player_details = async (req) => {
  return {user_id:req.params.id, coach_id:req.user.coach_id }
}
exports.process_get_player_details = async (input_data) => {
  var {user_id, coach_id} = input_data
  var player_details = []
  await models.User.findOne({
    where: {id: user_id}
  }).then((data) => {player_details = data})
  if (player_details.dataValues.status === "inactive"){
    throw new Api400Error("Player is inactive")
  }
  console.log(player_details)
  return player_details;

}
exports.post_process_get_player_details = (resp, data) => {
  resp.status(200).send({status:"success",message:"retrieved data successfully", data: data.dataValues})
}

exports.pre_process_get_attendance = async (req) => {
  return {coach_id:req.user.coach_id, batch_id:req.body.batch_id, date:req.body.date}
}

exports.process_get_attendance = async (input_data) => {
  const {coach_id, batch_id, date} = input_data
  attendance_details = []
  const attendance = await models.Attendance.findAll({
    where: {
      [sequelize.Op.and]: [
        sequelize.where(sequelize.fn('DATE', sequelize.col('createdAt')), date),
        {coach_id: coach_id, batch_id: batch_id}
      ]
    }
  })
  for(let attendance_detail of attendance){
    const user = await models.User.findOne({where:{id:attendance_detail.user_id}})
    attendance_details.push({
      user_id: attendance_detail.user_id,
      name: user.name,
      attendance: attendance_detail.attendance,
      status: attendance_detail.status
    })
  }
  return attendance_details
}

exports.post_process_get_attendance = async (resp,data) => {
  resp.status(200).send({status:"success",message:"retrieved data successfully", data})
}


exports.pre_process_add_fcm_token = async (req) => {
  return {coach_id:req.user.coach_id, fcm_token:req.body.fcm_token}
}

exports.process_add_fcm_token = async (input_data) => {
  const { coach_id, fcm_token } = input_data
  await models.Coach.update({ fcm_token: fcm_token }, {
      where: {
          id:coach_id
      }
  })
}

exports.post_process_add_fcm_token = async (resp) => {
  resp.status(200).send({ status: "success", message: "fcm token added successfully", data: {} })
}

exports.pre_process_pay_reminder = async (req) => {
  return {player_id:req.query.player_id}
}

exports.process_pay_reminder = async (input_data) => {
  var { player_id} = input_data
  const user = await models.User.findOne({
    where: {id: player_id}
  })
  const payment_reminder = `${user['name']}, Your coach has requested for a payment. Please proceed according or expect a discontinuation of your sevices`
  send_push_notifications("eypvdFFQQSqKDdvVrzUwpU:APA91bHz8kUUenGSthOSU6sGD316PNJL-tQn6wQBZJnqUQu2K6Pqmhnc6xUwlzMQQNJxWf5Hdeedl1LblaOzPeYAb_eo_46nyB0inJT6ZiFxHL2LM9NCPgWPSZIKAHs2DLRI-lJwyYat", {
    title: "Payment Reminder",
    body: payment_reminder,
  })
 return payment_reminder
}

exports.post_process_pay_reminder = async (resp) => {
  resp.status(200).send({ status: "success", message: "payment reminder sent successfully", data: {} })
}

exports.pre_process_get_batch_subscription_details_of_coach = async (req) => {
  batch_id = req.params.id
  coach_id=req.user.coach_id
  return {coach_id, batch_id}
}

exports.process_get_batch_subscription_details_of_coach = async (input_data) => {
  var { coach_id, batch_id} = input_data
  const subscription_detail = await models.SubscriptionPlan.findAll({
    where: {
      batch_id:batch_id
    }
  })
  return subscription_detail
}

exports.post_process_get_batch_subscription_details_of_coach = async (resp,data) => {
  resp.status(200).send({status:"success",message:"retrieved data successfully", data})
}