const models = require('../models')
const Api400Error = require('../error/api400Error')
const {uploadFile} = require('../lib/upload_files_s3')

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
    return req.user.user_id
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
        const academy_details = await models.Academy.findByPk(batch_data.dataValues.academy_id)
        const sports_details = await models.Sports.findByPk(batch_data.dataValues.sports_id)
        
        const arena_data = arena_details != null ? { "name": arena_details["name"], "lat": arena_details["lat"], "lng": arena_details["lng"], "city":arena_details["city"],"locality":arena_details["locality"],"state":arena_details["state"] } : null
        const academy_data = academy_details != null ?  { "name": academy_details["name"]} : null
        const sports_data = sports_details !=null ? {"id":sports_details["id"],"name":sports_details["name"],"type":sports_details["type"]} : null
        
        const obj = {
                    "id": batch_data.dataValues["id"],
                    "arena_id": batch_data.dataValues["arena_id"],
                    "coach_id": batch_data.dataValues["coach_id"],
                    "academy_id": batch_data.dataValues["academy_id"],
                    "sports_id": batch_data.dataValues["sports_id"],
                    "days": batch_data.dataValues["days"],
                    "start_time": batch_data.dataValues["start_time"],
                    "end_time": batch_data.dataValues["end_time"],
                    "arena_data":arena_data,
                    "academy_data":academy_data,
                    "sports_data": sports_data
        }
        const days_arr = JSON.parse(batch_data.days)
        for (let i = 0; i < 7; i++){
            if (days_arr[i] == 1) {
                weekly_classes[(i+1)%7].push(obj)
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
    resp.status(200).send({ status: "success", message: "retrieved upcoming classes successfully", data: data })
}
exports.pre_process_upload_profile_pic = async (req) => {
    if (req.files == null || req.files.image == null) {
        throw new Api400Error("Image Not Provided")
    }
    return {user_id:req.params.id ,image:req.files.image }
}

exports.process_upload_profile_pic = async (input_data) => {
    const { user_id, image } = input_data
    const img_url = await uploadFile(image)
    const user = await models.User.update({ profilePic: img_url }, {
        where: {
            id:user_id
        }
    })
    return {img_url}
}

exports.post_process_upload_profile_pic = async (data,resp) => {
    resp.status(200).send({status:"success",message:"profile pic updated successfully ", data:data})
}
