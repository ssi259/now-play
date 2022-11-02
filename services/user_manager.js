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