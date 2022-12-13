const dbConfig = require("../config/db_config.js");
const models = require("../models");
const Api400Error = require('../error/api400Error')

exports.pre_process_reschedule = async(req,resp)=>{
  }
  exports.process_reschedule_input_req = async(req,resp,input_response)=>{
    const {
        batch_id,previous_end_time,previous_start_time,
        updated_start_time,updated_end_time,previous_start_date,updated_start_date,
        previous_end_date,updated_end_date,previous_days,updated_days} = req.body;
    
    if (batch_id == null) {
        return resp.status(400).send({ status: "Failure", details: "batch_id Not Provided" })
    }
    const batch_detail = await models.findAll({
        where: {
            id: req.user.coach_id,
            status: 'active'
        }
    })
        // time of first timespan
    var p_start_time = new Date(`${previous_start_date} ${previous_start_time} `).getTime();
    var p_end_time = new Date(`${previous_end_date} ${previous_end_time} `).getTime();

    // time of second timespan
    var u_start_time = new Date(`${updated_start_date} ${updated_start_time} `).getTime();
    var u_end_time = new Date(`${updated_end_date} ${updated_end_time} `).getTime();

    if (Math.min(p_start_time, p_end_time) <= Math.max(u_start_time, u_end_time) && Math.max(p_start_time, p_end_time) >= Math.min(u_start_time, u_end_time)) {
        // between
    }
    for (each_batch_detail of batch_detail){
    

    const rescheduled = await Reschedule.create({batch_id,previous_end_time,previous_start_time,
        updated_start_time,updated_end_time,previous_start_date,updated_start_date,
        previous_end_date,updated_end_date,previous_days,updated_days
    })
 }
    return rescheduled
  }
  
  exports.post_reschedule_process = async(req,resp,input_response)=>{
    resp.status(200).send({ status: "success", data: rescheduled, message: "class Rescheduled"})
  }