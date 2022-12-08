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

exports.pre_process_get_all_enrollments_details = async () => {
    return 
}

exports.process_get_all_enrollments_details = async () => {
    const enrollments = await models.Enrollment.findAll({
        where: {
            status: "active"
        }
    })
    const userEnrollments = await Promise.all(enrollments.map(async (enrollment) => {
        enrollment = enrollment.toJSON()
        const arena_id = (await models.Batch.findByPk(enrollment.batch_id)).arena_id;
        const academy_id = (await models.Batch.findByPk(enrollment.batch_id)).academy_id;
        const sports_id = (await models.Batch.findByPk(enrollment.batch_id)).sports_id;
        enrollment.arena_name = (await models.Arena.findByPk(arena_id)).name;
        enrollment.academy_name = (await models.Academy.findByPk(academy_id)).name;
        enrollment.sports_name = (await models.Sports.findByPk(sports_id)).name;
        enrollment.Plan_name = (await models.SubscriptionPlan.findByPk(enrollment.subscription_id)).plan_name;
        enrollment.coach_name = (await models.User.findByPk(enrollment.coach_id)).name;
        return enrollment
    }))
    return userEnrollments;
}

exports.post_process_get_all_enrollments_details = async (data, resp) => {
    resp.status(200).send({ status: "success", message: "retrieved enrollments successfully", data: data })
}