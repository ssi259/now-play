const rescheduleManager = require('../services/reschedule_manager');

exports.reschedule_class = async (req, resp) => {
    try {
        const input_data = await rescheduleManager.pre_process_reschedule_class(req);
        const reschedule = await rescheduleManager.process_reschedule_class(input_data);
        await rescheduleManager.post_process_reschedule_class(reschedule, resp);
    } catch (e) {
        console.log(e)
        const status_code = e.statusCode ? e.statusCode : 500
        return resp.status(status_code).send({ status: "Failure", message: e.name })
    }
}