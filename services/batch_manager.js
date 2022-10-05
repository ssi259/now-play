const dbConfig = require("../config/db_config.js");

const Sequelize = require("sequelize");
const models = require("../models");
const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min
  }
});

exports.pre_process_params = async(req,resp)=>{
    const result =await batch.query("SELECT batches.id , batches.price ,batches.start_time, batches.end_time,batches.days , arena.name AS arena_name, coaches.name AS coach_name , coaches.experience, coaches.rating, sports.name,sports.type, (6371 *acos(cos(radians("+ req.query.lat + ")) * cos(radians(lat)) * cos(radians(lng) - radians("+req.query.lng+")) + sin(radians("+req.query.lat+")) * sin(radians(lat)))) AS distance FROM (((Batches batches INNER JOIN Arenas arena on batches.id = arena.id) INNER JOIN Coaches coaches ON batches.coach_id = coaches.id) INNER JOIN Sports sports ON batches.sports_id = sports.id) HAVING distance < 100000   ORDER BY distance LIMIT 0, 20;",{ type: Sequelize.QueryTypes.SELECT }).then((result)=>{
        return batch;
    }).catch((error)=>{
        console.log(error)
    })
    return JSON.stringify(result);   
}
exports.process_batch_input_req = async(input_response)=>{
    return input_response
}
exports.post_process = async(req,resp,input_response)=>{
    resp.send(input_response)
}


exports.pre_process_create_batch = async(req,resp)=>{
    const result = await  models.Batch.create({id:req.body.id,coach_id: req.body.coach_id,sports_id: req.body.sports_id,days: req.body.date,price: req.body.price,start_time: req.body.start_time,end_time: req.body.end_time}).then(function (batch) {
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