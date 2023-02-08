const models = require('../models')
const Api400Error = require('../error/api400Error');
const { Op } = require('sequelize')
const create_send_notification =  require('../utilities/Notification/create_send_notification')

exports.pre_process_reschedule = async (req) => {
    let { batch_id, updated_date, updated_start_time, previous_start_time, previous_end_time, previous_start_date, type } = req.body
    if (previous_start_date == null || previous_start_time == null || previous_end_time == null) {
        throw new Api400Error("previous_start_date, previous_start_time and previous_end_time are required");
    }
    const coach_id = req.user.coach_id
    previous_start_date = await convert_to_ddmmyyyy(previous_start_date);
    previous_start_date = await IN_to_UTC_date(previous_start_date);
    if (updated_date != null) {
        updated_date = await IN_to_UTC_date(updated_date);
    }
    return {coach_id , batch_id, updated_date, updated_start_time,previous_start_date, previous_start_time,previous_end_time, type};
}

exports.process_reschedule = async (input_data) => {
    const {coach_id, batch_id, updated_date, updated_start_time, previous_start_date, previous_end_time, previous_start_time, type } = input_data;
    if (type == 'canceled') {
        let canceled_class = await models.Reschedule.create({
            batch_id,
            previous_start_date,
            previous_start_time,
            previous_end_time,
            type
        })
        create_send_notification.class_reschedule({class_data : canceled_class.dataValues ,class_type:'canceled',coach_id})
        return { message: "class canceled", data: canceled_class}
    }
    const  updated_end_time =  await calculate_updated_end_time(previous_start_time, previous_end_time , updated_start_time)
    const is_time_slot_conflict = await check_time_slot_conflict({coach_id, batch_id , updated_date ,updated_start_time ,updated_end_time , previous_start_date, previous_start_time , previous_end_time });
    if (is_time_slot_conflict == true) {
        throw new Api400Error("time slot conflict")
    }
    const rescheduled_class = await models.Reschedule.create({
        batch_id,
        updated_date ,
        updated_start_time,
        updated_end_time,
        previous_start_date,
        previous_start_time,
        previous_end_time,
        type: "rescheduled"
    })
    create_send_notification.class_reschedule({class_data : rescheduled_class.dataValues , class_type : 'rescheduled',coach_id})
    return { message: "class rescheduled", data:rescheduled_class }
}

exports.post_process_reschedule = async (data, resp) => {
    resp.status(201).send({ status: 'success', message: data.message,data:data.data})
}

exports.pre_process_getReschedule = async (req) => {
    return req.query
}

exports.process_getReschedule = async (query) => {
    const reschedule = await models.Reschedule.findAll()
    for (const each_reschedule of reschedule) {
        each_reschedule.dataValues.batch = await models.Batch.findOne({
            where: {
                id: each_reschedule.dataValues.batch_id
            }
        })
        each_reschedule.dataValues.coach = await models.Coach.findOne({
        where: {
            id: each_reschedule.dataValues.batch.coach_id
        }
    })
    }

    return reschedule
}

exports.post_process_getReschedule = async (reschedule, resp) => {
    resp.status(200).send({status:"success",message:"reschedule data retrieved successfully",data:reschedule})
}

async function IN_to_UTC_date(indianDateString){
    const UTC_date_string = indianDateString.split("/").reverse().join("-");
    return new Date(UTC_date_string)
}

async function calculate_updated_end_time(previous_start_time, previous_end_time, updated_start_time) {
    const previousStart = new Date("1970-01-01 " + previous_start_time)
    const previousEnd = new Date("1970-01-01 " + previous_end_time);
    const previousDifference = previousEnd - previousStart;
    const updatedStart = new Date("1970-01-01 " + updated_start_time);
    const updatedEnd = new Date(updatedStart.getTime() + previousDifference);
    return updatedEnd.toTimeString().slice(0, 8);
}

async function check_time_slot_conflict(input_data){
    const {coach_id , batch_id, updated_date, updated_start_time, updated_end_time, previous_start_date } = input_data
    const updated_date_str = updated_date.toLocaleDateString("en-IN").substring(0, 10)
    const batches = await models.Batch.findAll({
        where: {
            coach_id : coach_id
        },
        attributes : ['id', 'days', 'start_time', 'end_time', 'createdAt']
    })
    for (let batch of batches){
        const rescheduled_classes = await models.Reschedule.findAll({
            where: {
                batch_id: batch['id'],
                type: 'rescheduled',
                [Op.or]: [
                    { updated_date: updated_date },
                    { previous_start_date: previous_start_date },
                ]
            }
        })
        const canceled_classes = await models.Reschedule.findAll({
            where: {
                batch_id: batch['id'],
                type: 'canceled',
                previous_start_date: updated_date
            }
        })
        let updated_day_classes = []
        const batch_days_arr = JSON.parse(batch['days'])
        const get_updated_day_index = updated_date.getDay()
        let j = ((get_updated_day_index % 7) + 6) % 7
        if (batch_days_arr[j] == 1) {
            updated_day_classes.push({
                start_time: batch['start_time'],
                end_time: batch['end_time'],
                createdAt: batch['createdAt']
            })
        }
        for (let rsdld_cls of rescheduled_classes) {
            const rsdld_cls_previous_start_date = new Date(rsdld_cls['previous_start_date'])
            const rsdld_cls_previous_start_date_str = rsdld_cls_previous_start_date.toLocaleDateString("en-IN").substring(0, 10)
            if (rsdld_cls_previous_start_date_str == updated_date_str) {
                updated_day_classes = updated_day_classes.filter((item) => item['start_time'] != rsdld_cls['previous_start_time'])
            }
            const rsdld_cls_updated_date = new Date(rsdld_cls['updated_date'])
            const rsdld_cls_updated_date_str = rsdld_cls_updated_date.toLocaleDateString("en-IN").substring(0, 10)
            if (rsdld_cls_updated_date_str == updated_date_str) {
                updated_day_classes.push({
                    start_time: rsdld_cls['updated_start_time'],
                    end_time: rsdld_cls['updated_end_time'],
                    createdAt: rsdld_cls['createdAt']
                })
            }
        }
        for (let cncld_class of canceled_classes) {
            const cncld_class_previous_start_date = new Date(cncld_class['previous_start_date'])
            const cncld_class_previous_start_date_str = cncld_class_previous_start_date.toLocaleDateString("en-IN").substring(0, 10)
            if (cncld_class_previous_start_date_str == updated_date_str) {
                updated_day_classes = updated_day_classes.filter((item) => item['start_time'] != cncld_class['previous_start_time'] || cncld_class['createdAt'] < item['createdAt'])
            }
        }
        for (let i = 0; i < updated_day_classes.length; i++) {
            if (updated_day_classes[i]['start_time'] <= updated_start_time && updated_start_time <= updated_day_classes[i]['end_time'] || updated_day_classes[i]['start_time'] <= updated_end_time && updated_end_time <= updated_day_classes[i]['end_time']) {
                return true
            }
        }
        updated_day_classes = []
    }
    return false
}

async function convert_to_ddmmyyyy (date_str) {
    let [dd, mm, yyyy] = date_str.split("/")
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    return [dd, mm, yyyy].join('/')
}