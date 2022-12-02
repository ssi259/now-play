const dbConfig = require("../config/db_config.js");
const axios = require('axios')
const {Sequelize , Op} = require("sequelize");
const models = require("../models");
var lib = require('../lib/upload_files_s3');
const Api400Error = require('./../error/api400Error')
const Api500Error = require('./../error/api500Error')

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    host: dbConfig.host,
    dialect: dbConfig.dialect,

    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min
    }
});

exports.pre_process_params = async (req, resp) => {
    if (req.query.sports_id != null) {
        const results = await sequelize.query(`SELECT batches.id , batches.price ,batches.start_time, batches.end_time, batches.start_date, batches.end_date, batches.days , academy.id AS academy_id, academy.name AS academy_name, arena.name AS arena_name,arena.locality,arena.city,arena.state,arena.lat,arena.lng,coaches.id AS coach_id, coaches.name AS coach_name , coaches.experience, sports.id AS sport_id, sports.name AS sport_name,batches.thumbnail_img AS batch_thumbnail,sports.type FROM ((((Batches batches INNER JOIN Arenas arena on batches.arena_id = arena.id) INNER JOIN Coaches coaches ON batches.coach_id = coaches.id) INNER JOIN Sports sports ON batches.sports_id = sports.id) LEFT JOIN Academies academy on batches.academy_id = academy.id) where sports.id = ${req.query.sports_id};`, { type: Sequelize.QueryTypes.SELECT }).then((result) => {            return result;
        }).catch(() => {
            throw new Api500Error(`Error in batch search`)
        })
        return results;

    } else {const results = await sequelize.query("SELECT batches.id , batches.price ,batches.start_time, batches.end_time, batches.start_date, batches.end_date, batches.days , academy.id AS academy_id, academy.name AS academy_name, arena.name AS arena_name,arena.locality,arena.city,arena.state,arena.lat,arena.lng,coaches.id AS coach_id, coaches.name AS coach_name , coaches.experience, sports.id AS sport_id, sports.name AS sport_name,batches.thumbnail_img AS batch_thumbnail,sports.type FROM ((((Batches batches INNER JOIN Arenas arena on batches.arena_id = arena.id) INNER JOIN Coaches coaches ON batches.coach_id = coaches.id) INNER JOIN Sports sports ON batches.sports_id = sports.id) LEFT JOIN Academies academy on batches.academy_id = academy.id);", { type: Sequelize.QueryTypes.SELECT }).then((result) => {
            return result;
        }).catch((e) => {
            console.log(e)
            throw new Api500Error(`Error in batch search`)
        })
        return results;
    }
}
exports.process_batch_search_input_req = async (req,resp,input_response) => {
    var processed_response = [], overall_ratings = 0, ratings;
    if (input_response == null) {
        return input_response
    }
    for (each_input_response of input_response) {
        const plan = await models.SubscriptionPlan.findOne({where:{batch_id:each_input_response["id"]}})
        if(plan || req.query.type === "admin"){
            overall_ratings = 0;
            ratings = await models.Review.findAll({
                where: {
                    coach_id: each_input_response["coach_id"]
                }
            }).then((ratings) => {
                ratings.forEach((rating) => {
                    overall_ratings = overall_ratings + rating["rating"]
                })

                const data2 = { "rating_count": ratings.length, "average_rating": overall_ratings / ratings.length };
                Object.assign(each_input_response , { "distance": range(req.query.lat, req.query.lng,each_input_response["lat"],each_input_response["lng"] ,"k.m.")})
                Object.assign(each_input_response, data2)
                Object.assign(each_input_response, { "address": { "city": each_input_response["city"], "locality": each_input_response["locality"], "state": each_input_response["state"] } })
                delete each_input_response["city"]
                delete each_input_response["locality"]
                delete each_input_response["state"]
                processed_response.push(each_input_response)

            }).catch((error) => {
                console.log(error)
            })
        }
    }
    return processed_response;
}
exports.post_process_search_batch = async (req, resp, input_response) => {
    var formatted_response = {}
    var lat = req.query.lat
    var lng = req.query.lng
    const revgeocode_data = await axios.get(`https://revgeocode.search.hereapi.com/v1/revgeocode?at=${lat}%2C${lng}&lang=en-US&apiKey=${process.env.HERE_MAP_API_KEY}`);
    const revgeocode_address_label = revgeocode_data.data.items.length > 0 ? revgeocode_data.data.items[0].address.label : ""
    const revgeocode_address_district = revgeocode_data.data.items.length > 0 ? revgeocode_data.data.items[0].address.district : ""    
    formatted_response["address"] = {label:revgeocode_address_label,district:revgeocode_address_district}
    formatted_response["batchList"] = input_response
    resp.send(formatted_response)
}


exports.pre_process_create_batch = async (req) => {
    if (req.files==null || req.files.thumbnail_img==null){
        throw new Api400Error(`Thumbnail Image not found`)
    }

    if (req.files==null || req.files.banner_img==null){
        throw new Api400Error(`Banner Image not found`)
    }
    const thumbnail_img_url = await lib.uploadFile(req.files.thumbnail_img)
    const banner_img_url = await lib.uploadFile(req.files.banner_img)
    return { thumbnail_img_url, banner_img_url, data: JSON.parse(req.body.data) }
}
exports.process_batch_create_input_req = async (input_response) => {
    const {thumbnail_img_url , banner_img_url , data} = input_response
    const result = await models.Batch.create({
        arena_id: data.arena_id,
        coach_id: data.coach_id,
        academy_id: data.academy_id,
        sports_id: data.sports_id,
        days: data.days,
        price: data.price,
        thumbnail_img: thumbnail_img_url,
        banner_img: banner_img_url,
        start_time: data.start_time,
        end_time: data.end_time,
        start_date: data.start_date,
        end_date: data.end_date
    })
    return result
}

exports.post_process_create_batch = async ( resp, new_batch) => {
    resp.status(201).send({ status: "success", message: "batch created successfully", data: new_batch })
}

exports.pre_process_image_upload_request = async(req,resp)=>{
    if (req.files==null || req.files.files_name==null){
        throw new Api400Error(`image not found`)
    }
    if(req.query==null || req.query.batch_id==null){
        throw new Api400Error(`BAD REQUEST`)
    }
    return req
}
exports.process_image_upload_request = async(req,resp)=>{
    var input_files = req.files.files_name;
    var request_batch_id = req.query.batch_id;
    if(!(input_files instanceof Array)){
        await upload_and_create_data(input_files,request_batch_id)
    }else{
        await upload_multiple_files(input_files,request_batch_id)
    }
    resp.status(201).send("File Uploaded successfuly")
}
async function upload_multiple_files(input_files,request_batch_id){
    for(each_file of input_files){
        upload_and_create_data(each_file,request_batch_id)
    }
}
async function upload_and_create_data(each_file,request_batch_id){
    const image_location = await lib.uploadFile(each_file)
    await models.BatchPhotos.create({batchId: request_batch_id,img_url: image_location})
}

exports.pre_process_batch_details = async(req,resp)=>{
    const batch_details = await models.Batch.findOne({where: {id:req.params.id}});
        if (batch_details) {
            return batch_details
        } else {
            throw new Api400Error(`BAD REQUEST`)
        }

}
exports.process_batch_details_input_req = async(req,input_response)=>{
    const arena_details = await models.Arena.findOne({where:{id:input_response["arena_id"]}})
    const coach_details = await models.Coach.findOne({where:{id:input_response["coach_id"]}})
    const academy_details = await models.Academy.findOne({where:{id:input_response["academy_id"]}})
    const sports_details = await models.Sports.findOne({where:{id:input_response["sports_id"]}})
    const batch_pics = await models.BatchPhotos.findAll({where: {batchId: input_response["id"]}})
    const reviews_details = await models.Review.findAll({where: {coach_id: input_response["coach_id"]}}) 
    const arena_data = arena_details != null ? {"arena_name":arena_details["name"],"lat":arena_details["lat"],"lng":arena_details["lng"]} : null
    const coach_data = coach_details !=null ? {"coach_name":coach_details["name"],"coach_experience":coach_details["experience"],"coach_profile_pic":coach_details["profile_pic"],"about_coach":coach_details["about"]} : null
    const academy_data =  academy_details != null ? {"academy_name":academy_details["name"],"academy_phone_number":academy_details["phone_number"]} : null
    const sports_data =  sports_details !=null ? {"sports_name":sports_details["name"],"sports_type":sports_details["type"],"sports_about":sports_details["about"]} : null
    var batch_images = []
    for (each_batch_pic of batch_pics){
     await   batch_images.push(each_batch_pic.dataValues.img_url)
    
    }
    var image_list = {"batch_img_list":batch_images}
    review_list = []
    for(each_reviews_detail of reviews_details){
        var review_data = {"review_text":each_reviews_detail.dataValues.review_text, "review_time":each_reviews_detail.dataValues.createdAt}
        var user_detail = await models.User.findOne({where:{id: each_reviews_detail["user_id"]}})
        var reviewer_user_detail = {"reviewer_name":user_detail["name"],"reviewer_profile_pic":user_detail["profilePic"]}
        await Object.assign(review_data,reviewer_user_detail)
        review_list.push(review_data)
    } 
    var coach_reviews = {"coach_reviews":review_list}
    var overall_ratings = 0,rating_json={};
    await models.Review.findAll({
        where: {
            
            coach_id: input_response["coach_id"]
        }
    }).then((ratings) => {
        ratings.forEach((rating) => {
            overall_ratings = overall_ratings + rating["rating"]
        })
        rating_json = { "rating_count": ratings.length, "average_rating": overall_ratings / ratings.length };

    });
    Object.assign(input_response.dataValues,rating_json);
    Object.assign(input_response.dataValues,arena_data);
    Object.assign(input_response.dataValues, { "address": { "city": arena_details["city"], "locality":arena_details["locality"], "state": arena_details["state"] } })
    Object.assign(input_response.dataValues,coach_data);
    Object.assign(input_response.dataValues,academy_data);
    Object.assign(input_response.dataValues,sports_data);
    Object.assign(input_response.dataValues,image_list);
    Object.assign(input_response.dataValues,coach_reviews);
    Object.assign(input_response.dataValues, { "distance": range( req.query.lat,req.query.lng,arena_details["lat"],arena_details["lng"] , "k.M.")});

    return input_response
}  
    exports.post_process = async(req,resp,input_response)=>{
    resp.send(input_response)
}


exports.pre_process_upcoming_classes = async (req) => {
    return req.user.user_id
}

exports.process_upcoming_classes = async (user_id) => {
    const week_days = ['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday','Friday','Saturday']
    const weekly_classes = [[], [], [], [], [], [], []]
    let days_arr_length = 7; 

    const batches = await models.Enrollment.findAll({
        where: {
            user_id: user_id,
            type:"paid",
            status: {
                [Op.or]: ["active", "pending"]
            }
        },
        attributes: ['batch_id'],
        group: ['batch_id'],
    })
    for (const batch of batches) {
        const batch_data = await models.Batch.findByPk(batch.dataValues.batch_id)

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
        const days_arr = JSON.parse(batch_data.days)
        for (let i = 0; i < days_arr_length; i++){
            if (days_arr[i] == 1) {
                weekly_classes[(i+1)% days_arr_length].push(obj)
            }
        }
    }
    let j = 0;
    const response_data = [];
    const curr_day_index = get_curr_day()
    for (let i = curr_day_index; i < (days_arr_length + curr_day_index); i++){
        response_data.push({
            day:week_days[(i % days_arr_length)],
            date: ist_formate_date(j) ,
            classes :weekly_classes[(i % days_arr_length)]
        })
        j++;
    }
    return response_data
}

function ist_formate_date (days_gap) {
    const date = new Date()
    const local_date = new Date(date.getTime() + process.env.IN_UTC_TIMEZONE_OFFSET * 60 * 1000 + days_gap*24*60*60*1000)
    return local_date.toLocaleDateString("en-IN")
}

function get_curr_day() {
    const date = new Date()    
    const local_date = new Date(date.getTime() + process.env.IN_UTC_TIMEZONE_OFFSET * 60 * 1000)
    return local_date.getDay()
}

exports.post_process_upcoming_classes = async (data, resp) => {
    resp.status(200).send({ status: "success", message: "retrieved upcoming classes successfully", data: data })
}

function range(lat1, lng1, lat2, lng2, unit) {
    if ((lat1 == lat2) && (lng1 == lng2)) {
        return 0;
    }
    else {
        var radlat1 = Math.PI * lat1/180;
        var radlat2 = Math.PI * lat2/180;
        var theta = lng1-lng2;
        var radtheta = Math.PI * theta/180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180/Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit=="K.M.") { dist = dist * 1.609344 }
        return dist;    
    }
}

exports.pre_process_next_class = async (req) => {
    return req.user.user_id
}

exports.process_next_class = async (user_id) => {
    const week_days = ['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday','Friday','Saturday']
    const weekly_classes = [[], [], [], [], [], [], []]
    let days_arr_length = 7; 
    const batches = await models.Enrollment.findAll({
        where: {
            user_id: user_id,
            status: {
                [Op.or]: ["active", "pending"]
            }
        },
        attributes: ['batch_id'],
        group:['batch_id']
    })
    for (const batch of batches) {
        const batch_data = await models.Batch.findByPk(batch.dataValues.batch_id)    
        const days_arr = JSON.parse(batch_data.days)
        for (let i = 0; i < days_arr_length; i++){
            if (days_arr[i] == 1) {
                weekly_classes[(i+1)% days_arr_length].push(batch_data)
            }
        }
    }
    for (let i = 0; i < days_arr_length; i++) weekly_classes[i].sort((batch_1, batch_2) => batch_1.start_time > batch_2.start_time ? 1 : -1)   
    let j = 0;
    const response_data = [];
    const curr_day_index = get_curr_day()
    for (let i = curr_day_index; i < (days_arr_length + curr_day_index); i++){
        for (let single_class of weekly_classes[(i % days_arr_length)]) {
            if (i != curr_day_index || single_class.dataValues.start_time > get_curr_time_hhmmss()) {
                response_data.push({
                    day: week_days[(i % days_arr_length)],
                    date: ist_formate_date(j),
                    class: await get_class_details(single_class)
                })
                return response_data
            }
        }
        j++;
    }
    return response_data
}

function get_curr_time_hhmmss() {
    const date = new Date()
    const a = new Date(date.getTime() + process.env.IN_UTC_TIMEZONE_OFFSET * 60 * 1000)
    return ((a.getHours() < 10 ? ('0'+a.getHours()): a.getHours()) + ':' + (a.getMinutes()<10 ? ('0'+a.getMinutes()): a.getMinutes()) + ':00')
}

async function get_class_details(single_class) {
    const arena_details = await models.Arena.findByPk(single_class.dataValues.arena_id)
    const academy_details = await models.Academy.findByPk(single_class.dataValues.academy_id)
    const sports_details = await models.Sports.findByPk(single_class.dataValues.sports_id)
    const arena_data = arena_details != null ? { "name": arena_details["name"], "lat": arena_details["lat"], "lng": arena_details["lng"], "city":arena_details["city"],"locality":arena_details["locality"],"state":arena_details["state"] } : null
    const academy_data = academy_details != null ?  { "name": academy_details["name"]} : null
    const sports_data = sports_details !=null ? {"id":sports_details["id"],"name":sports_details["name"],"type":sports_details["type"]} : null
    const data = {
        "id": single_class.dataValues["id"],
        "arena_id": single_class.dataValues["arena_id"],
        "coach_id": single_class.dataValues["coach_id"],
        "academy_id": single_class.dataValues["academy_id"],
        "sports_id": single_class.dataValues["sports_id"],
        "days": single_class.dataValues["days"],
        "start_time": single_class.dataValues["start_time"],
        "end_time": single_class.dataValues["end_time"],
        "arena_data":arena_data,
        "academy_data":academy_data,
        "sports_data": sports_data
    }
    return data
}

exports.post_process_next_class = async (data, resp) => {
    resp.status(200).send({ status: "success", message: "retrieved data successfully", data: data })
}


exports.pre_process_update_batch = async (req) => {
    console.log("pre_process_update_batch", req.params.id, req.body)
    return {batch_id:req.params.id, data: req.body}
  }

  exports.process_update_batch = async (input_data) => {
    const { batch_id, data } = input_data
    console.log(batch_id, data);
    const [affected_rows] = await models.Batch.update(data, {where: {id:batch_id}})
    if (!affected_rows) {
      throw new Api400Error("invalid request")
    }
  }

  exports.post_process_update_batch = async (processed_response, resp) => {
    resp.status(200).send({status:"success",updated_data: processed_response, message:"batch updated successfully"})
  }