const models = require('../models')
const Api400Error = require('../error/api400Error');
const { DatabaseError } = require('sequelize');

exports.pre_process_reschedule = async (req) => {
    const coach_id = req.user.coach_id;
    const batch_id = req.body.batch_id;
    const updated_date = req.body.updated_date;
    const updated_start_time = req.body.updated_start_time;
    const previous_start_time = req.body.previous_start_time;
    const previous_end_time = req.body.previous_end_time;
    const previous_start_date = req.body.previous_start_date;
    return {coach_id, batch_id, updated_date, updated_start_time, previous_end_time, previous_start_time, previous_start_date};
}

exports.process_reschedule = async (input_data) => {
    const {coach_id, batch_id, updated_date, updated_start_time,previous_end_time,previous_start_date,previous_start_time} = input_data;
    let end_time = new Date("2021-01-12 "+previous_end_time);
    let start_time = new Date("2021-01-12 "+ previous_start_time);
    const duration = (new Date(end_time) - new Date(start_time))/60000;
    let updated_end_time = new Date(updated_date+" "+updated_start_time);
    updated_end_time.setMinutes(updated_end_time.getMinutes() + duration);
    updated_end_time = updated_end_time.toTimeString().split(" ")[0];
    if(!batch_id){
        throw new Api400Error("batch_id is required");
    }
    rescheduled_class = await models.Reschedule.create({
        batch_id,
        updated_date,
        updated_start_time,
        updated_end_time,
        previous_start_date,
        previous_start_time,
        type: "rescheduled"
    })
    if(updated_date == null || updated_start_time==null || updated_end_time==null){
        await models.Reschedule.update({
            type: "cancel"
        }, {
            where: {
                id: rescheduled_class.id
            }
        })
        return { status: "Success", message: "Class Cancelled"}
    }
    
    const batches = await models.Batch.findAll({
        where: {
           coach_id: coach_id, 
        }
    })
    for(var each_batch of batches){
        each_batch = each_batch.dataValues;
        actual_class_days = JSON.parse(each_batch.days)

        days = ["Mon", "Tues", "Wed", "Thurs", "Fri", "Sat", "Sun"] 
        js_days = ["Sun","Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"]

        actual_class_days = actual_class_days.map((day, index) => {
            if(day == 1){
                return days[index]
            }
        })

        if ((each_batch.start_date <= new Date(updated_date) && new Date(updated_date) <=each_batch.end_date) && actual_class_days.includes(js_days[(new Date(updated_date)).getDay()])){
           if((each_batch.start_time <= updated_start_time && updated_start_time <= each_batch.end_time) || (each_batch.start_time <= updated_end_time && updated_end_time <= each_batch.end_time)){
                await models.Reschedule.destroy({
                    where: {
                        id: rescheduled_class.id
                    }
                })
                throw new Api400Error("Time Slot Conflict")
            }
    }
}   
    return { status: "Success", message: "Class Rescheduled", data: rescheduled_class}
}

exports.post_process_reschedule = async (reschedule, resp) => {
    resp.status(200).send({ status: reschedule.status, message: reschedule.message,data:reschedule.data})
}



