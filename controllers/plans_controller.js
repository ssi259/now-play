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
exports.update = async (req, resp) => {
    try {
        var input_response = await plan_manager.pre_process_update(req)
        var process_response = await plan_manager.process_update(input_response)
        var post_process_response = await plan_manager.post_process_update(process_response, resp)
    } catch (e) {
        const status_code = e.statusCode ? e.statusCode : 500
        return resp.status(status_code).send({ status: "Failure", message: e.name })
    }
}


exports.getPlanByBatchId = async (req, resp) => {
    try {
        var input_response = await plan_manager.pre_process_get_plan_by_batch_id(req)
        var process_response = await plan_manager.process_get_plan_by_batch_id(input_response)
        var post_process_response = await plan_manager.post_process_get_plan_by_batch_id(process_response, resp)
    } catch (e) {
        const status_code = e.statusCode ? e.statusCode : 500
        return resp.status(status_code).send({ status: "Failure", message: e.name })
    }
}



