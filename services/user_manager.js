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
