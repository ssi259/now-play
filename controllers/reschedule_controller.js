const rescheduleManager = require('../services/reschedule_manager');

exports.rescheduling = async (req, resp) => {
    try {
        const input_data = await rescheduleManager.pre_process_reschedule(req);
        const reschedule = await rescheduleManager.process_reschedule(input_data);
        await rescheduleManager.post_process_reschedule(reschedule, resp);
    } catch (e) {
        console.log(e)
        const status_code = e.statusCode ? e.statusCode : 500
        return resp.status(status_code).send({ status: "Failure", message: e.name })
    }
}