const complaint_manager = require('../services/complaint_manager')

exports.create = async (req, resp) => {
    try {
        const  input_response = await complaint_manager.pre_process_create(req)
        const  processed_response = await complaint_manager.process_create(input_response)
        await complaint_manager.post_process_create(processed_response,resp)
    } catch (e) {
        const status_code = e.statusCode ? e.statusCode : 500
        return resp.status(status_code).send({ status: "failure", message: e.name,data:{}})
    }
}

exports.get = async (req, resp) => {
    try {
        const input_response = await complaint_manager.pre_process_get(req)
        const processed_response = await complaint_manager.process_get()
        await complaint_manager.post_process_get(processed_response,resp)
    } catch (e) {
        const status_code = e.statusCode ? e.statusCode : 500
        return resp.status(status_code).send({ status: "failure", message: e.name,data:{}})
    }
}

exports.update = async (req, resp) => {
    try {
        const input_response = await complaint_manager.pre_process_update(req)
        const processed_response = await complaint_manager.process_update(input_response)
        await complaint_manager.post_process_update(processed_response,resp)
    } catch (e) {
        console.log(e)
        const status_code = e.statusCode ? e.statusCode : 500
        return resp.status(status_code).send({ status: "failure", message: e.name,data:{}})
    }
}