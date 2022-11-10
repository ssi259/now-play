const user_manager = require('../services/user_manager')

exports.get_user_by_id = async (req, resp) => {
    try {
        var input_response = await user_manager.pre_process_get_user_by_id(req)
        var processed_response = await user_manager.process_get_user_by_id(input_response)
        await user_manager.post_process_get_user_by_id(processed_response, resp)
    } catch (e) {
        const status_code = e.statusCode ? e.statusCode : 500
        return resp.status(status_code).send({ status: "failure", message: e.name, data:{} })
    }
}

exports.update_user_by_id = async (req, resp) => {
    try {
        var input_response = await user_manager.pre_process_update_user_by_id(req)
        var processed_response = await user_manager.process_update_user_by_id(input_response,req)
        await user_manager.post_process_update_user_by_id(resp)
    } catch (e) {
        const status_code = e.statusCode ? e.statusCode : 500
        return resp.status(status_code).send({ status: "failure", message: e.name})
    }
}

exports.get_upcoming_classes = async (req, resp) => {
    try {
        var input_response = await user_manager.pre_process_upcoming_classes(req)
        var processed_response = await user_manager.process_upcoming_classes(input_response)
        await user_manager.post_process_upcoming_classes(processed_response, resp)
    } catch (e) {
        const status_code = e.statusCode ? e.statusCode : 500
        return resp.status(status_code).send({ status: "failure", message: e.name })
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