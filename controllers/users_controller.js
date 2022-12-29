const user_manager = require('../services/user_manager')

exports.get_user = async (req, resp) => {
    try {
        var input_response = await user_manager.pre_process_get_user(req)
        var processed_response = await user_manager.process_get_user(input_response)
        await user_manager.post_process_get_user(processed_response, resp)
    } catch (e) {
        const status_code = e.statusCode ? e.statusCode : 500
        return resp.status(status_code).send({ status: "failure", message: e.name, data:{} })
    }
}

exports.update_user = async (req, resp) => {
    try {
        var input_response = await user_manager.pre_process_update_user(req)
        var processed_response = await user_manager.process_update_user(input_response,req)
        await user_manager.post_process_update_user(resp)
    } catch (e) {
        const status_code = e.statusCode ? e.statusCode : 500
        return resp.status(status_code).send({ status: "failure", message: e.name})
    }
}
    
exports.upload_profile_pic = async (req, resp) => {
    try {
        var input_response = await user_manager.pre_process_upload_profile_pic(req)
        var processed_response = await user_manager.process_upload_profile_pic(input_response)
        await user_manager.post_process_upload_profile_pic(processed_response,resp)
    } catch (e) {
        const status_code = e.statusCode ? e.statusCode : 500
        return resp.status(status_code).send({ status: "failure", message: e.name,data:{}})
    }
}

exports.get_all_users = async (req, resp) => {
    try {
        var input_response = await user_manager.pre_process_get_all_users(req)
        var processed_response = await user_manager.process_get_all_users(input_response)
        await user_manager.post_process_get_all_users(processed_response, resp)
    } catch (e) {
        console.log(e)
        const status_code = e.statusCode ? e.statusCode : 500
        return resp.status(status_code).send({ status: "failure", message: e.name,data:{}})
    }
}

exports.update_user_on_adminPanel = async (req, resp) => {
    try {
        var input_response = await user_manager.pre_process_update_user_on_adminPanel(req)
        var processed_response = await user_manager.process_update_user_on_adminPanel(input_response)
        await user_manager.post_process_update_user_on_adminPanel(processed_response, resp)
    } catch (e) {
        console.log(e)
        const status_code = e.statusCode ? e.statusCode : 500
        return resp.status(status_code).send({ status: "failure", message: e.name,data:{}})
    }
}

exports.add_fcm_token = async (req, resp) => {
    try {
        var input_response = await user_manager.pre_process_add_fcm_token(req)
        await user_manager.process_add_fcm_token(input_response)
        await user_manager.post_process_add_fcm_token(resp)
    } catch (e) {
        console.log(e)
        const status_code = e.statusCode ? e.statusCode : 500
        return resp.status(status_code).send({ status: "failure", message: e.name,data:{}})
    }
}