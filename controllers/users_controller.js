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