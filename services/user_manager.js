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
        const days_arr = JSON.parse(batch_data.days)
        for (let i = 0; i < 7; i++){
            if (days_arr[i] == 1) {
                weekly_classes[(i+1)%7].push(batch_data)
            }
        }
    }
    let j = 0;
    const data = [];
    const curr_day_index = (new Date()).getDay();
    for (let i = curr_day_index; i < 7 + curr_day_index; i++){
        data.push({
            date: ist_formate_date(j) ,
            classes :weekly_classes[(i % 7)]
        })
        j++;
    }   
    return data
}

function ist_formate_date (days_gap) {
    const date = new Date()
    date.setDate(date.getDate() + days_gap)
    return date.toLocaleDateString()
}

exports.post_process_upcoming_classes = async (data, resp) => {
    resp.status(200).send({status:"success",message:"retrieved upcoming classes successfully", data:data})
}