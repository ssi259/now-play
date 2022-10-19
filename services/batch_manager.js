const dbConfig = require("../config/db_config.js");

const Sequelize = require("sequelize");
const models = require("../models");
const batch = require("../models/batch.js");
const coach = require("../models/coach.js");
const { Router } = require("express");
const { router } = require("../app.js");
const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min
  }
});

exports.pre_process_params = async(req,resp)=>{
const results =await sequelize.query("SELECT batches.id , batches.price ,batches.start_time, batches.end_time,batches.days , arena.name AS arena_name, coaches.name AS coach_name , coaches.experience, coaches.rating, sports.name,sports.type, (6371 *acos(cos(radians("+ req.query.lat + ")) * cos(radians(lat)) * cos(radians(lng) - radians("+req.query.lng+")) + sin(radians("+req.query.lat+")) * sin(radians(lat)))) AS distance FROM (((Batches batches INNER JOIN Arenas arena on batches.id = arena.id) INNER JOIN Coaches coaches ON batches.coach_id = coaches.id) INNER JOIN Sports sports ON batches.sports_id = sports.id) HAVING distance < 100000   ORDER BY distance LIMIT 0, 20;",{ type: Sequelize.QueryTypes.SELECT }).then((result)=>{
        return results;
    }).catch((error)=>{
        console.log(error)
    })
    return JSON.stringify(results);   
}
exports.process_batch_input_req = async(input_response)=>{
    return input_response
}
exports.post_process = async(req,resp,input_response)=>{
    resp.send(input_response)
}


exports.pre_process_create_batch = async(req,resp)=>{
    const result = await  models.Batch.create({arena_id: req.body.arena_id,coach_id: req.body.coach_id,academy_id: req.body.academy_id,sports_id: req.body.sports_id,days: req.body.days,price: req.body.price,thumbnail_img: req.body.thumbnail_img,start_time: req.body.start_time,end_time: req.body.end_time,start_date: req.body.start_date,end_date: req.body.end_date}).then(function (batch) {
        if (batch) {
            resp.send(batch);
        } else {
            resp.status(400).send('Error in insert new record');
        }
    });
}
exports.process_batch_input_req = async(input_response)=>{
    return input_response
}
exports.post_process = async(req,resp,input_response)=>{
    resp.send(input_response)
}

exports.pre_process_batch_details = async(req,resp)=>{
    const batch_details = await models.Batch.findOne({where: {id:req.params.id}});
        if (batch_details) {
            return batch_details
        } else {
            resp.status(400).send('details not found');
        }
     
}
exports.process_batch_details_input_req = async(input_response)=>{
    const arena_details = await models.Arena.findOne({where:{id:input_response["arena_id"]}})
    const coach_details = await models.Coach.findOne({where:{id:input_response["coach_id"]}})
    const academy_details = await models.Academy.findOne({where:{id:input_response["academy_id"]}})
    const sports_details = await models.Sports.findOne({where:{id:input_response["sports_id"]}})
        var processed_reponse = []
        const arena_data = {"arena_name":arena_details["name"],"lat":arena_details["lat"],"lng":arena_details[lng]}
        const coach_data = {"coach_name":coach_details["name"],"coach_experience":coach_details["experience"],"coach_profile_pic":coach_details["profile_pic"]}
        const academy_data = {"academy_name":academy_details["name"],"academy_phone_number":academy_details["phone_number"]}
        const sports_data = {"sports_name":sports_details["name"],"sports_type":sports_details["type"],"sports_about":sports_details["about"]}
        Object.assign(input_response.dataValues,arena_data);
        Object.assign(input_response.dataValues,coach_data);
        Object.assign(input_response.dataValues,academy_data);
        Object.assign(input_response.dataValues,sports_data);

    return input_response
}  

exports.post_process = async(req,resp,input_response)=>{
    resp.send(input_response)
}