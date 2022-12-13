const dbConfig = require("../config/db_config.js");
const models = require("../models");
const Api400Error = require('../error/api400Error')

exports.pre_process_reschedule = async(req,resp)=>{
    return {coach_id:req.user.coach_id}
  }
  exports.process_reschedule_input_req = async(req,resp,input_response)=>{
    const batch_id = req.body.batch_id;
      if (batch_id == null) {
          return resp.status(400).send({ status: "Failure", details: "batch_id Not Provided" })
      }
    const rescheduled = await models.Reschedule.create({batch_id: req.body.batch_id,previous_end_time: req.body.previous_end_time,previous_start_time: req.body.previous_start_time,
        updated_start_time: req.body.updated_start_time,updated_end_time: req.body.updated_end_time,previous_start_date: req.body.previous_start_date,updated_start_date: req.body.updated_start_date,
        previous_end_date: req.body.previous_end_date,updated_end_date: req.body.updated_end_date
    })
    if (updated_start_time == null, updated_end_time == null, updated_start_date == null, updated_end_date == null) {
        await models.Reschedule.update({ status: 'cancelled' }, { where: { id: rescheduled.id } })
        resp.status(201).send({ status: "Success", message: "Class Has Been Cancelled" })
    }
    const batch_detail = await models.Batches.findAll({
        where: {
            id: req.user.coach_id,
            status: 'active'
        }
    })
    for (each_batch_detail of batch_detail){

    // time of first timespan
    var p_start_time = new Date(`${each_batch_detail.start_date} ${each_batch_detail.start_time} `).getTime();
    var p_end_time = new Date(`${each_batch_detail.end_date} ${each_batch_detail.end_time} `).getTime();

    // time of second timespan
    var u_start_time = new Date(`${updated_start_date} ${updated_start_time} `).getTime();
    var u_end_time = new Date(`${updated_end_date} ${updated_end_time} `).getTime();

    if (Math.min(p_start_time, p_end_time) <= Math.max(u_start_time, u_end_time) && Math.max(p_start_time, p_end_time) >= Math.min(u_start_time, u_end_time)) {
        return resp.status(400).send({ status: "Failure", details: `time conflict with batch_id: ${each_batch_detail.id},please change time` })
    }
 }
    return rescheduled
  }

  exports.post_reschedule_process = async(req,resp,input_response)=>{
    resp.status(200).send({ status: "success", data: rescheduled, message: "class Rescheduled"})
  }