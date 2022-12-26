const models = require('../models')
const Api400Error = require('../error/api400Error')

exports.pre_process_reschedule_class = async (req) => {
    const coach_id = req.user.coach_id;
    const batch_id = req.body.batch_id;
    const reschedule_date = req.body.reschedule_date;
    const reschedule_start_time = req.body.reschedule_start_time;
    const reschedule_end_time = req.body.reschedule_end_time;
    return {coach_id, batch_id, reschedule_date, reschedule_start_time, reschedule_end_time};
}

exports.process_reschedule_class = async (input_data) => {
    const {coach_id, batch_id, reschedule_date, reschedule_start_time, reschedule_end_time} = input_data;
    if(!batch_id){
        throw new Api400Error("batch_id is required");
    }
    rescheduled_class = await models.Reschedule_class.create({
        batch_id,
        reschedule_date,
        reschedule_start_time,
        reschedule_end_time,
        type: "reschedule"
    })
    if(reschedule_date == null || reschedule_start_time==null || reschedule_end_time==null){
        await models.Reschedule_class.update({
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

        if ((each_batch.start_date <= new Date(reschedule_date) && new Date(reschedule_date) <=each_batch.end_date) && actual_class_days.includes(js_days[(new Date(reschedule_date)).getDay()])){
           if((each_batch.start_time <= reschedule_start_time && reschedule_start_time <= each_batch.end_time) || (each_batch.start_time <= reschedule_end_time && reschedule_end_time <= each_batch.end_time)){
                await models.Reschedule_class.destroy({
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

exports.post_process_reschedule_class = async (reschedule, resp) => {
    resp.status(200).send({ status: reschedule.status, message: reschedule.message,data:reschedule.data})
}
