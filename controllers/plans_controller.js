const plan_manager = require('../services/plan_manager')

exports.create = async (req, resp) => {
    try {
        var input_response = await plan_manager.pre_process_create(req)
        var process_response = await plan_manager.process_create(input_response)
        var post_process_response = await plan_manager.post_process_create(process_response, resp)
    } catch (e) {
        const status_code = e.statusCode ? e.statusCode : 500
        return resp.status(status_code).send({ status: "Failure", message: e.name })
    }
}


