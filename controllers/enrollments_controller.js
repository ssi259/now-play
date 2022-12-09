const enrollment_manager = require('../services/enrollment_manager')

exports.get_enrollments = async (req, resp) => {
    try {
        var input_response = await enrollment_manager.pre_process_get_user_enrollments(req)
        var processed_response = await enrollment_manager.process_get_user_enrollments(input_response)
        await enrollment_manager.post_process_get_user_enrollments(processed_response, resp)
    } catch (e) {
        const status_code = e.statusCode ? e.statusCode : 500
        return resp.status(status_code).send({ status: "failure", message: e.name})
    }
}

exports.get_all_enrollments_details = async (req, resp) => {
    try {
        var input_response = await enrollment_manager.pre_process_get_all_enrollments_details()
        var processed_response = await enrollment_manager.process_get_all_enrollments_details(input_response)
        await enrollment_manager.post_process_get_all_enrollments_details(processed_response, resp)
    } catch (e) {
        console.log(e)
        const status_code = e.statusCode ? e.statusCode : 500
        return resp.status(status_code).send({ status: "failure", message: e.name })
    }
}