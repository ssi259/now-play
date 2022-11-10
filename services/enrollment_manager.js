const models = require('../models')

exports.pre_process_get_user_enrollments = async (req) => {
    return req.user.user_id
}

exports.process_get_user_enrollments = async (user_id) => {
    const enrollments = await models.Enrollment.findAll({
        where: {
            user_id: user_id,
            status:"active"
        }
    })
    return enrollments;
}

exports.post_process_get_user_enrollments = async (data, resp) => {
    resp.status(200).send({status:"success",message:"retrieved enrollments successfully", data : data})
}