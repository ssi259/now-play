const models = require('../models')
const Api400Error = require('../error/api400Error')
const {uploadFile} = require('../lib/upload_files_s3')

exports.pre_process_get_user = async (req) => {
    return req.user.user_id
}

exports.process_get_user = async (user_id) => {
    const user = await models.User.findByPk(user_id)
    if (!user) {
        throw new Api400Error("bad request")
    }
    return user;
} 

exports.post_process_get_user = async (user, resp) => {
    resp.status(200).send({status:"success",message:"user retrieved successfully",data:user})
}


exports.pre_process_update_user = async (req) => {
    return {user_id: req.user.user_id , data:req.body}
}

exports.process_update_user = async (input_data, req) => {
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

exports.post_process_update_user = async (resp) => {
    resp.status(200).send({status:"success",message:"user updated successfully"})
}


exports.pre_process_upload_profile_pic = async (req) => {
    if (req.files == null || req.files.image == null) {
        throw new Api400Error("Image Not Provided")
    }
    return {user_id:req.user.user_id,image:req.files.image }
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

exports.pre_process_get_all_users = async (req) => {
    return req.query
}

exports.process_get_all_users = async (query) => {
    const users = await models.User.findAll()   
    return users
}

exports.post_process_get_all_users = async (users, resp) => {
    resp.status(200).send({status:"success",message:"users retrieved successfully",data:users})
}

exports.pre_process_update_user_on_adminPanel = async (req) => {
    return {"user_id":req.params.id,"status":req.body.status}
}

exports.process_update_user_on_adminPanel = async (input_response) => {
    const { user_id, status } = input_response
    const [affected_rows] = await models.User.update({"status":status}, {
        where: {
          id:user_id
        }
    })
    if (!affected_rows) {
        throw new Api400Error("invalid request")
    }
    return affected_rows
}

exports.post_process_update_user_on_adminPanel = async (affected_rows, resp) => {
    resp.status(200).send({status:"success",message:"user updated successfully"})
}

exports.pre_process_add_fcm_token = async (req) => {
    return {user_id:req.user.user_id, fcm_token:req.body.fcm_token}
}

exports.process_add_fcm_token = async (input_data) => {
    const { user_id, fcm_token } = input_data
    const user = await models.fcm_token.create({user_id, fcm_token})
    return user
}

exports.post_process_add_fcm_token = async (user, resp) => {
    resp.status(200).send({status:"success",message:"fcm token added successfully",data:user})
}