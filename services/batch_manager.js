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
    logging: false,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min
    }
});


exports.pre_process_params = async (req) => {
    var sql
    if (req.query.type == "admin") {
        sql = "select Batches.id, Batches.arena_id, Batches.coach_id,Batches.academy_id, Batches.sports_id as sport_id, Batches.days, Batches.price,Batches.status, Batches.thumbnail_img as batch_thumbnail,start_time, end_time, start_date,end_date, Arenas.name as arena_name ,Arenas.lat  , Arenas.lng, Arenas.state, Arenas.city, Arenas.locality, Coaches.name as coach_name , Coaches.experience, Academies.name as academy_name, Sports.name as sport_name,Sports.type from Batches Inner Join Arenas ON Batches.arena_id = Arenas.id Inner Join Coaches On Batches.coach_id = Coaches.id Inner Join Academies On Batches.academy_id = Academies.id Inner Join Sports On Batches.sports_id = Sports.id"   
    }else if (req.query.sports_id != null){
        sql = `select Batches.id, Batches.arena_id, Batches.coach_id,Batches.academy_id, Batches.sports_id as sport_id, Batches.days, Batches.price,Batches.status, Batches.thumbnail_img as batch_thumbnail,start_time, end_time, start_date,end_date, Arenas.name as arena_name ,Arenas.lat  , Arenas.lng, Arenas.state, Arenas.city, Arenas.locality, Coaches.name as coach_name , Coaches.experience, Academies.name as academy_name, Sports.name as sport_name,Sports.type from Batches Inner Join Arenas ON Batches.arena_id = Arenas.id Inner Join Coaches On Batches.coach_id = Coaches.id Inner Join Academies On Batches.academy_id = Academies.id Inner Join Sports On Batches.sports_id = Sports.id where Batches.status='active' AND Batches.sports_id=${req.query.sports_id}`
    }
    else {
        sql = "select Batches.id, Batches.arena_id, Batches.coach_id,Batches.academy_id, Batches.sports_id as sport_id, Batches.days, Batches.price,Batches.status, Batches.thumbnail_img as batch_thumbnail ,start_time, end_time, start_date,end_date, Arenas.name as arena_name ,Arenas.lat  , Arenas.lng, Arenas.state, Arenas.city, Arenas.locality, Coaches.name as coach_name , Coaches.experience, Academies.name as academy_name, Sports.name as sport_name,Sports.type from Batches Inner Join Arenas ON Batches.arena_id = Arenas.id Inner Join Coaches On Batches.coach_id = Coaches.id Inner Join Academies On Batches.academy_id = Academies.id Inner Join Sports On Batches.sports_id = Sports.id where Batches.status='active'"   
    }
    const results = await sequelize.query(sql, (err, result) => {
        if(err) throw err
    })
    return  results != null && results.length > 0 ?  results[0] : null
}

exports.process_batch_search_input_req = async (req, results) => {
    var processed_response = [];
    if (results == null) {
        return results
    }
    for (each_result of results) {
        const sql = `SELECT SUM(rating) as tot_rating, COUNT(*) as num_ratings FROM Reviews WHERE coach_id = ${each_result['coach_id']}`
        const [{tot_rating ,num_ratings} ] = await sequelize.query(sql, { type: sequelize.QueryTypes.SELECT })
        each_result.rating_count = num_ratings || 0
        each_result.average_rating = tot_rating /  num_ratings
        each_result.address = { "state": each_result["state"], "city": each_result["city"], "locality": each_result["locality"] }
        each_result.distance = range(req.query.lat, req.query.lng,each_result["lat"],each_result["lng"] ,"k.m.")
        processed_response.push(each_result)
    }
    return processed_response
}
exports.post_process_search_batch = async (req, resp, processed_reponse) => {
    var lat = req.query.lat
    var lng = req.query.lng
    const revgeocode_data = await axios.get(`https://revgeocode.search.hereapi.com/v1/revgeocode?at=${lat}%2C${lng}&lang=en-US&apiKey=${process.env.HERE_MAP_API_KEY}`);
    const revgeocode_address_label = revgeocode_data.data.items.length > 0 ? revgeocode_data.data.items[0].address.label : ""
    const revgeocode_address_district = revgeocode_data.data.items.length > 0 ? revgeocode_data.data.items[0].address.district : ""    
    resp.send({
        address: { label: revgeocode_address_label, district: revgeocode_address_district },
        batchList : processed_reponse
    })
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
    for(let each_reviews_detail of reviews_details){
        var review_data = {"review_text":each_reviews_detail.dataValues.review_text, "review_time":each_reviews_detail.dataValues.createdAt,"review_rating":each_reviews_detail.dataValues.rating}
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
        if (unit=="K.M.") { dist = dist * 1.609344}
        if (dist >= 10 && dist <= 20 )
        {
            dist = dist * 1.73653709
        }
        if (dist >= 0 && dist <= 10 )
        {
            dist = dist * 1.932079724
        }
        if (dist >= 20 && dist <= 30 )
        {
            dist = dist * 1.328324484
        }
        return dist;    
    }
}

exports.pre_process_next_class = async (req) => {
    return req.user
}

exports.process_next_class = async (user) => {
    const week_days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const date_weekday = {}
    let upcoming_classes = {}
    let batches;  
    if (user.type == 'coach') {
        batches = await models.Batch.findAll({
            where: {
                coach_id:user.coach_id,
                status: 'active'
            }
        })
    }
    else if (user.type == 'player') {
        batches = await models.Enrollment.findAll({
            where: {
                user_id: user.user_id,
                type:"paid",
                status: {
                    [Op.or]: ["active", "pending"]
                }
            },
            attributes: ['batch_id'],
            group: ['batch_id'],
        })
    }
    for (let batch of batches) {
        const batch_id = user.type == 'player' ? batch['batch_id'] : batch['id']
        const batch_data = await batch_details_upcoming_classes(batch_id)
        const rescheduled_classes = await models.Reschedule.findAll({
            where: {
                batch_id: batch_id,
                type:"rescheduled"
            }
        })
        const cancelled_classes = await models.Reschedule.findAll({
            where: {
                batch_id: batch_id,
                type:"canceled"
            }
        })
        const today_index = get_curr_day()
        let days_after = 0;
        const days_arr = JSON.parse(batch_data['days'])
        for (let i = today_index; i < today_index + 7; i++){
            let j = ((i % 7) + 6) % 7
            const date = await date_after_gap(days_after)  
            date_weekday[date] = week_days[i%7]
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
            const previous_start_date_str =   previous_start_date.toLocaleDateString("en-IN").substring(0, 10)      
            if (upcoming_classes[previous_start_date_str] != null) {
                upcoming_classes[previous_start_date_str] = await  upcoming_classes[previous_start_date_str].filter((item) => item['id'] != rsdld_cls['batch_id'] || item['start_time'] != rsdld_cls['previous_start_time'])
            }
            const updated_date = new Date(rsdld_cls['updated_date'])
            const updated_date_str = updated_date.toLocaleDateString("en-IN").substring(0, 10)
            if (upcoming_classes[updated_date_str] != null) {
                upcoming_classes[updated_date_str].push(rsdld_cls_data)
            }
        }
        for (let cncld_class of cancelled_classes) {
            const previous_start_date = new Date(cncld_class['previous_start_date'])
            const previous_start_date_str =   previous_start_date.toLocaleDateString("en-IN").substring(0, 10)      
            if (upcoming_classes[previous_start_date_str] != null) {
                upcoming_classes[previous_start_date_str] = await  upcoming_classes[previous_start_date_str].filter((item) => item['id'] != cncld_class['batch_id'] || item['start_time'] != cncld_class['previous_start_time'] || cncld_class['createdAt'] < item['createdAt'])
            }
        }
    }
    for (let date in upcoming_classes) upcoming_classes[date].sort((class_1, class_2) => class_1.start_time > class_2.start_time ? 1 : -1) 
    for (const date in upcoming_classes) {
        for (let single_class of upcoming_classes[date]) {
            if ((await date_after_gap(0) != date) || single_class['start_time'] > get_curr_time_hhmmss()) {
                return [{
                    day:date_weekday[date],
                    date: date,
                    class:single_class
                }]
            }
        }
    }
    return []
}

function get_curr_time_hhmmss() {
    const date = new Date()
    const a = new Date(date.getTime() + process.env.IN_UTC_TIMEZONE_OFFSET * 60 * 1000)
    return ((a.getHours() < 10 ? ('0'+a.getHours()): a.getHours()) + ':' + (a.getMinutes()<10 ? ('0'+a.getMinutes()): a.getMinutes()) + ':00')
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

exports.pre_process_get_batch_images = async (req) => {
    return 
}

exports.process_get_batch_images = async (input_data) => {
    const batch_data = await models.BatchPhotos.findAll()
    return batch_data
}

exports.post_process_get_batch_images = async (processed_response, resp) => {
    resp.status(200).send({status:"success",data: processed_response, message:"batch images retrieved successfully"})
}

exports.pre_process_upcoming_classes = async (req) => {
    return req.user
}

exports.process_upcoming_classes = async (user) => {
    const week_days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const date_weekday = {}
    let upcoming_classes = {}
    let batches;  
    if (user.type == 'coach') {
        batches = await models.Batch.findAll({
            where: {
                coach_id:user.coach_id,
                status: 'active'
            }
        })
    }
    else if (user.type == 'player') {
        batches = await models.Enrollment.findAll({
            where: {
                user_id: user.user_id,
                type:"paid",
                status: {
                    [Op.or]: ["active", "pending"]
                }
            },
            attributes: ['batch_id'],
            group: ['batch_id'],
        })
    }
    for (let batch of batches) {
        const batch_id = user.type == 'player' ? batch['batch_id'] : batch['id']
        const batch_data = await batch_details_upcoming_classes(batch_id)
        const rescheduled_classes = await models.Reschedule.findAll({
            where: {
                batch_id: batch_id,
                type:"rescheduled"
            }
        })
        const cancelled_classes = await models.Reschedule.findAll({
            where: {
                batch_id: batch_id,
                type:"canceled"
            }
        })
        const today_index = (new Date()).getDay()
        let days_after = 0;
        const days_arr = JSON.parse(batch_data['days'])
        for (let i = today_index; i < today_index + 7; i++){
            let j = ((i % 7) + 6) % 7
            const date = await date_after_gap(days_after)  
            date_weekday[date] = week_days[i%7]
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
            const previous_start_date_str =   previous_start_date.toLocaleDateString("en-IN").substring(0, 10)      
            if (upcoming_classes[previous_start_date_str] != null) {
                upcoming_classes[previous_start_date_str] = await  upcoming_classes[previous_start_date_str].filter((item) => item['id'] != rsdld_cls['batch_id'] || item['start_time'] != rsdld_cls['previous_start_time'])
            }
            const updated_date = new Date(rsdld_cls['updated_date'])
            const updated_date_str = updated_date.toLocaleDateString("en-IN").substring(0, 10)
            if (upcoming_classes[updated_date_str] != null) {
                upcoming_classes[updated_date_str].push(rsdld_cls_data)
            }
        }
        for (let cncld_class of cancelled_classes) {
            const previous_start_date = new Date(cncld_class['previous_start_date'])
            const previous_start_date_str =   previous_start_date.toLocaleDateString("en-IN").substring(0, 10)      
            if (upcoming_classes[previous_start_date_str] != null) {
                upcoming_classes[previous_start_date_str] = await  upcoming_classes[previous_start_date_str].filter((item) => item['id'] != cncld_class['batch_id'] || item['start_time'] != cncld_class['previous_start_time'] || cncld_class['createdAt'] < item['createdAt'])
            }
        }
    }
    for (let date in upcoming_classes) upcoming_classes[date].sort((class_1, class_2) => class_1.start_time > class_2.start_time ? 1 : -1) 
    const result = []
    for (const date in upcoming_classes){
        result.push({
            day:date_weekday[date],
            date: date,
            classes: await date_after_gap(0) == date ? upcoming_classes[date].filter((class_item) => class_item['end_time'] > get_curr_time_hhmmss()) : upcoming_classes[date]
        })
    }
    return result
}
  
exports.post_process_upcoming_classes = async (resp, data) => {
    resp.status(200).send({status:"success",message:"retrieved data successfully", data})
}
  
async function date_after_gap(gap) {
    const date = new Date(Date.now() + process.env.IN_UTC_TIMEZONE_OFFSET * 60 * 1000 + gap * 24 * 60 * 60 * 1000 )
    return  date.toLocaleDateString("en-IN").substring(0, 10)
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
        "days":batch_data['days'],
        "arena_data": arena_data,
        "academy_data": academy_data,
        "sports_data": sports_data,
        "createdAt":batch_data['createdAt'],
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
        "createdAt":rsdld_cls_data['createdAt'],
        "type":"rescheduled"
    }
}