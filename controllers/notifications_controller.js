
const notification_manager = require('../services/notification_manager')

exports.get_notifications = async (req, resp) => {
    try {
        var input_response = await notification_manager.pre_process_notifications(req)
        var processed_resp = await notification_manager.process_notifications(input_response)
        await notification_manager.post_process_notifications( processed_resp, resp)
    } catch (e) {
        console.log(e)
        const status_code = e.statusCode ? e.statusCode : 500
        return resp.status(status_code).send({ status: "failure", message: e.name,data:[]})
    }
}

exports.update_notifications = async (req, resp) => {
    try {
        var input_response = await notification_manager.pre_process_update_notifications(req)
        var processed_resp = await notification_manager.process_update_notifications(input_response)
        await notification_manager.post_process_update_notifications(resp, processed_resp)
    } catch (e) {
        console.log(e)
        const status_code = e.statusCode ? e.statusCode : 500
        return resp.status(status_code).send({ status: "failure", message: e.name, data: {} })
    }
}