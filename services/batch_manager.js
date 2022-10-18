const dbConfig = require("../config/db_config.js");

const Sequelize = require("sequelize");
const models = require("../models");
var lib = require('../lib/upload_files_s3');
const router = require("../routes/batches.js");
const { Batch, Route53RecoveryCluster } = require("aws-sdk");
const { Router } = require("express");

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min
  }
});

exports.pre_process_params = async(req,resp)=>{
const results =await sequelize.query("SELECT batches.id , batches.price ,batches.start_time, batches.end_time,batches.days , academy.id AS academy_id, academy.name AS academy_name, arena.name AS arena_name,arena.locality,arena.city,arena.state,coaches.id AS coach_id, coaches.name AS coach_name , coaches.experience, sports.id AS sport_id, sports.name AS sport_name,sports.thumbnail AS sport_thumbnail,sports.type, (6371 *acos(cos(radians("+ req.query.lat + ")) * cos(radians(lat)) * cos(radians(lng) - radians("+req.query.lng+")) + sin(radians("+req.query.lat+")) * sin(radians(lat)))) AS distance FROM ((((Batches batches INNER JOIN Arenas arena on batches.id = arena.id) INNER JOIN Coaches coaches ON batches.coach_id = coaches.id) INNER JOIN Sports sports ON batches.sports_id = sports.id) LEFT JOIN Academies academy on batches.id = academy.id) HAVING distance < 100000   ORDER BY distance LIMIT 0, 20;",{ type: Sequelize.QueryTypes.SELECT }).then((result)=>{
        return result;
    }).catch((error)=>{
        console.log(error)
    })
    return results;   
}
exports.process_batch_search_input_req = async(input_response)=>{
    var processed_response = [] , overall_ratings = 0,ratings;
    for(each_input_response of input_response){
        overall_ratings = 0;
        ratings = await models.Review.findAll({
            where: {
            coach_id: each_input_response["coach_id"]
          }
        }).then((ratings)=>{
            ratings.forEach((rating)=>{
                overall_ratings =  overall_ratings + rating["rating"]
            })
            
            const data2 = {"rating_count":ratings.length,"average_rating":overall_ratings/ratings.length};            

            Object.assign(each_input_response,data2)
            Object.assign(each_input_response,{"address":{"city":each_input_response["city"],"locality":each_input_response["locality"],"state":each_input_response["state"]}})
            delete each_input_response["city"]
            delete each_input_response["locality"]
            delete each_input_response["state"]
            processed_response.push(each_input_response)

        }).catch((error)=>{
            console.log(error)
        })
    }
    return processed_response;
}
exports.post_process_search_batch = async(req,resp,input_response)=>{
    var formatted_response = {}
    formatted_response["address"] = "Delhi"
    formatted_response["batchList"] = input_response 
    resp.send(formatted_response)
}


exports.pre_process_create_batch = async(req,resp)=>{
    const result = await  models.Batch.create({arena_id: req.body.arena_id,coach_id: req.body.coach_id,academy_id: req.body.academy_id,sports_id: req.body.sports_id,days: req.body.days,price: req.body.price,thumbnail_img: req.body.thumbnail_img,banner_img: req.body.banner_img,start_time: req.body.start_time,end_time: req.body.end_time,start_date: req.body.start_date,end_date: req.body.end_date}).then(function (batch) {
        if (batch) {
            resp.send(batch);
        } else {
            resp.status(400).send('Error in insert new record');
        }
    });
}
exports.process_batch_create_input_req = async(input_response)=>{
    return input_response
}
exports.post_process_create_batch = async(req,resp,input_response)=>{
    resp.send(input_response)
}
exports.pre_process_image_upload_request = async(req,resp)=>{
    var input_files = req.files.files_name;
    var request_batch_id = req.query.batch_id;
    if (req.files==null || input_files==null){
        resp.status(400).send("Image is not present")
    }
    if(req.query==null || request_batch_id==null){
        resp.status(400).send("Batch Id not provided")
    }
    else{
        return req
    }
}
exports.process_image_upload_request = async(req,resp)=>{
    var input_files = req.files.files_name;
    var request_batch_id = req.query.batch_id;
    if(!(input_files instanceof Array)){
        await upload_and_create_data(input_files,request_batch_id)
    }else{
        await upload_multiple_files(input_files,request_batch_id)
    }
    resp.status(200).send("File Uploaded successfuly")
}
async function upload_multiple_files(input_files,request_batch_id){
    for(each_file of input_files){
        upload_and_create_data(each_file,request_batch_id)
    }
}
async function upload_and_create_data(each_file,request_batch_id){
    const image_location = await lib.uploadFile(each_file)
    models.BatchPhotos.create({batchId: request_batch_id,img_url: image_location})
}

  
exports.pre_process_batch_details = async(req,resp)=>{
    const details = await models.Batch.findOne({where: {id:req.params.id}});
        if (details) {
            return details
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
  // const data2 = {"rating_count":ratings.length,"average_rating":overall_ratings/ratings.length};
    const coach_data = {"coach_name":coach_details["name"],"coach_experience":coach_details["experience"],"coach_profile_pic":coach_details["profile_pic"]}
  //  const academy_data = (academy_details["name"],academy_details["phone_number"])
    //Object.assign(input_response,arena_details);
    Object.assign(input_response,coach_data);
  //  Object.assign(input_response,academy_data);
    //Object.assign(input_response,sports_details);
   console.log(input_response)
   input_response= input_response
   return  JSON.stringify(input_response)
}



