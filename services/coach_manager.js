const { Coach, CoachImage, CoachDocument} = require('../models');
const {uploadFile} = require('../lib/upload_files_s3')
const Api400Error = require('../error/api400Error')
const {Op} = require('sequelize')
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
  
  const reviews = await models.Review.findAll({ where: coach_id })
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
  return await Promise.all(coach_batches.map(async (batch) => {
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
      batch_data.payments = await collection_detail(enrollments , status)
    }
    else {
      const payments = await models.Payment.findAll({
        where: {
          batch_id: batch.id,
          status: status
        }
      })
      batch_data.payments = await collection_detail(payments , status)
    }
    return batch_data
  }))
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
        name: user['name'],
        profilePic:user["profilePic"],
      },
      plan: {
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
  return {"students_enrolled":student_enrolled.length , "pending_payments_total":payments[0].dataValues.pending_payments_total};
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
  return coach_details
}

exports.post_process_get_coach_details = async (resp,data) => {
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
  return {coach_id:req.user.coach_id};
}

exports.process_get_attendance = async (input_data) => {
  const attendance = await models.Attendance.findAll({
    where: {coach_id: input_data.coach_id,
            createdAt: {
              [Op.between]: [new Date(new Date().setHours(0, 0, 0)), new Date(new Date().setHours(23, 59, 59))]
           }
          }
  })
  return attendance;
}

exports.post_process_get_attendance = async (resp, data) => {
  resp.status(200).send({status:"success",message:"retrieved data successfully", data: data})
}

exports.pre_process_upcoming_classes = async (req) => {
  return {coach_id:req.user.coach_id}
}

exports.process_upcoming_classes = async (input_data) => {
  const { coach_id } = input_data
  let upcoming_classes = {}
  const batches = await models.Batch.findAll({
    where: {
      coach_id,
      status:'active'
    }
  })
  for (let batch of batches) {
    const rescheduled_classes = await models.Reschedule.findAll({
      where: {
        batch_id: batch['id'],
        type:"rescheduled"
      }
    })
    const cancelled_classes = await models.Reschedule.findAll({
      where: {
        batch_id: batch['id'],
        type:"canceled"
      }
    })
    const batch_data = await batch_details_upcoming_classes(batch['id'])
    const today_index = (new Date()).getDay()
    let days_after = 0;
    const days_arr = JSON.parse(batch['days'])
    for (let i = today_index; i < today_index + 7; i++){
      let j = ((i % 7) + 6) % 7
      const date = await date_after_gap(days_after)      
      if (upcoming_classes[date] == null) {
        upcoming_classes[date] = []
      }
      if (days_arr[j] == 1) {
        upcoming_classes[date].push(batch_data)
      }
      days_after++;
    }
    for (let rsdld_cls of rescheduled_classes) {
      const rsdld_cls_data = await rescheduled_class_data(batch_data , rsdld_cls.dataValues)
      const previous_start_date = new Date(rsdld_cls['previous_start_date'])
      const previous_start_date_str =   previous_start_date.toLocaleDateString().substring(0, 10)      
      if (upcoming_classes[previous_start_date_str] != null) {
        upcoming_classes[previous_start_date_str] = await  upcoming_classes[previous_start_date_str].filter((item) => item['id'] != rsdld_cls['batch_id'] || item['start_time'] != rsdld_cls['previous_start_time'])
      }
      const updated_date = new Date(rsdld_cls['updated_date'])
      const updated_date_str = updated_date.toLocaleDateString().substring(0, 10)
      if (upcoming_classes[updated_date_str] != null) {
        upcoming_classes[updated_date_str].push(rsdld_cls_data)
      }
    }
    for (let cncld_class of cancelled_classes) {
      const previous_start_date = new Date(cncld_class['previous_start_date'])
      const previous_start_date_str =   previous_start_date.toLocaleDateString().substring(0, 10)      
      if (upcoming_classes[previous_start_date_str] != null) {
        upcoming_classes[previous_start_date_str] = await  upcoming_classes[previous_start_date_str].filter((item) => item['id'] != cncld_class['batch_id'] || item['start_time'] != cncld_class['previous_start_time'])
      }
    }
  }
  for ( let date in upcoming_classes ) upcoming_classes[date].sort((class_1, class_2) => class_1.start_time > class_2.start_time ? 1 : -1)  
  return upcoming_classes
}

exports.post_process_upcoming_classes = async (resp, data) => {
  resp.status(200).send({status:"success",message:"retrieved data successfully", data})
}

async function date_after_gap(gap) {
  const date = new Date(Date.now() + gap * 24 * 60 * 60 * 1000)
  return  date.toLocaleDateString().substring(0, 10)
}

async function batch_details_upcoming_classes(batch_id){
  const batch_data = await models.Batch.findByPk(batch_id)
  const arena_details = await models.Arena.findByPk(batch_data.dataValues.arena_id)
  const academy_details = await models.Academy.findByPk(batch_data.dataValues.academy_id)
  const sports_details = await models.Sports.findByPk(batch_data.dataValues.sports_id)
  
  const arena_data = arena_details != null ? { "name": arena_details["name"], "lat": arena_details["lat"], "lng": arena_details["lng"], "city": arena_details["city"], "locality": arena_details["locality"], "state": arena_details["state"] } : null
  const academy_data = academy_details != null ? { "name": academy_details["name"] } : null
  const sports_data = sports_details != null ? { "id": sports_details["id"], "name": sports_details["name"], "type": sports_details["type"] } : null

  const data = {
    "id": batch_data.dataValues["id"],
    "start_time": batch_data["start_time"],
    "end_time": batch_data["end_time"],
    "day":batch_data['days'],
    "arena_data": arena_data,
    "academy_data": academy_data,
    "sports_data": sports_data,
    "type":"regular"
  }
  return data
}

async function rescheduled_class_data(batch_data, rsdld_cls_data) {
  return {
    "id": batch_data["id"],
    "start_time": rsdld_cls_data["updated_start_time"],
    "end_time": rsdld_cls_data["updated_end_time"],
    "arena_data": batch_data['arena_data'],
    "academy_data": batch_data['academy_data'],
    "sports_data": batch_data['sports_data'],
    "type":"rescheduled"
  }
}