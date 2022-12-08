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
    const batch_detail = await models.findOne({
        where: {
            id: batch_id,
            status: 'active'
        }
    })
    if (previous_end_date != batch_detail.end_date) {
        return resp.status(400).send({ status: "Failure", details: " previous_end_date is not correct" })
    }
    if (previous_start_date != batch_detail.start_date) {
        return resp.status(400).send({ status: "Failure", details: " previous_start_date is not correct" })
    }
    if (previous_end_time != batch_detail.end_time) {
        return resp.status(400).send({ status: "Failure", details: " previous_end_time is not correct" })
    }
    if (previous_start_time != batch_detail.start_time) {
        return resp.status(400).send({ status: "Failure", details: " previous_start_time is not correct" })
    }
    if (previous_days != batch_detail.days) {
        return resp.status(400).send({ status: "Failure", details: " previous_days are not correct" })
    }
    const rescheduled = await Reschedule.create({batch_id,previous_end_time,previous_start_time,
        updated_start_time,updated_end_time,previous_start_date,updated_start_date,
        previous_end_date,updated_end_date,previous_days,updated_days
    })
    return rescheduled
  }
  
  exports.post_reschedule_process = async(req,resp,input_response)=>{
    resp.status(200).send({ status: "success", data: rescheduled, message: "class Rescheduled"})
  }