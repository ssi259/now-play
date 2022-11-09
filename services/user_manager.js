const models = require('../models')
const Api400Error = require('../error/api400Error')

exports.pre_process_get_user_by_id = async (req) => {
    return req.params.id
}

exports.process_get_user_by_id = async (user_id) => {
    const user = await models.User.findByPk(user_id)
    if (!user) {
        throw new Api400Error("bad request")
    }
    return user;
} 

exports.post_process_get_user_by_id = async (user, resp) => {
    resp.status(200).send({status:"success",message:"user retrieved successfully",data:user})
}


exports.pre_process_update_user_by_id = async (req) => {
    return {user_id:req.params.id , data:req.body}
}

exports.process_update_user_by_id = async (input_data, req) => {
    const { user_id, data } = input_data
    const [affected_rows] = await models.User.update(data, {
        where: {
          id:user_id
        }
    })
    if (!affected_rows) {
        throw new Api400Error("invalid request")
    }
}

exports.post_process_update_user_by_id = async (resp) => {
    resp.status(200).send({status:"success",message:"user updated successfully"})
}


exports.pre_process_upcoming_classes = async (req) => {
    return req.params.id
}

exports.process_upcoming_classes = async (user_id) => {
    const week_days = ['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday','Friday','Saturday']
    const weekly_classes = [[], [], [], [], [], [], []]
    const batches = await models.Enrollment.findAll({
        where: {
            user_id: user_id,
            status: "active",
        },
        attributes: ['batch_id']
    })
    for (const batch of batches) {
        const batch_data = await models.Batch.findByPk(batch.dataValues.batch_id)

        const arena_details = await models.Arena.findByPk(batch_data.dataValues.arena_id)
        const coach_details = await models.Coach.findByPk(batch_data.dataValues.coach_id)
        const academy_details = await models.Academy.findByPk(batch_data.dataValues.academy_id)
        const sports_details = await models.Sports.findByPk(batch_data.dataValues.sports_id)
        
        const arena_data = arena_details != null ? { "name": arena_details["name"], "lat": arena_details["lat"], "lng": arena_details["lng"] } : null
        const coach_data = coach_details != null ?  {"name":coach_details["name"],"experience":coach_details["experience"],"profile_pic":coach_details["profile_pic"],"about":coach_details["about"]} :null
        const academy_data = academy_details != null ?  { "name": academy_details["name"], "phone_number": academy_details["phone_number"] } : null
        const sports_data = sports_details !=null ? {"name":sports_details["name"],"type":sports_details["type"],"about":sports_details["about"]} : null
        
        batch_data.dataValues['arena_data'] = arena_data
        batch_data.dataValues['coach_data'] = coach_data
        batch_data.dataValues['academy_data'] = academy_data
        batch_data.dataValues['sports_data'] = sports_data
        
        const days_arr = JSON.parse(batch_data.days)
        
        for (let i = 0; i < 7; i++){
            if (days_arr[i] == 1) {
                weekly_classes[(i+1)%7].push(batch_data)
            }
        }
    }
    let j = 0;
    const response_data = [];
    const curr_day_index = (new Date()).getDay();
    for (let i = curr_day_index; i < 7 + curr_day_index; i++){
        response_data.push({
            day:week_days[(i%7)],
            date: ist_formate_date(j) ,
            classes :weekly_classes[(i % 7)]
        })
        j++;
    }   
    return response_data
}

function ist_formate_date (days_gap) {
    const date = new Date()
    date.setDate(date.getDate() + days_gap)
    return date.toLocaleDateString()
}

exports.post_process_upcoming_classes = async (data, resp) => {
    resp.status(200).send({status:"success",message:"retrieved upcoming classes successfully", data:data})
}