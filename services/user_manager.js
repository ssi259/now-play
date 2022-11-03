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