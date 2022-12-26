const rescheduleManager = require('../services/reschedule_manager');

<<<<<<< HEAD
<<<<<<< HEAD
exports.rescheduling = async (req, resp) => {
    try {
        const input_data = await rescheduleManager.pre_process_reschedule(req);
        const reschedule = await rescheduleManager.process_reschedule(input_data);
        await rescheduleManager.post_process_reschedule(reschedule, resp);
=======
exports.reschedule_class = async (req, resp) => {
    try {
        const input_data = await rescheduleManager.pre_process_reschedule_class(req);
        const reschedule = await rescheduleManager.process_reschedule_class(input_data);
        await rescheduleManager.post_process_reschedule_class(reschedule, resp);
>>>>>>> 2ef35be (Implemeted reschedule class)
=======
exports.rescheduling = async (req, resp) => {
    try {
        const input_data = await rescheduleManager.pre_process_reschedule(req);
        const reschedule = await rescheduleManager.process_reschedule(input_data);
        await rescheduleManager.post_process_reschedule(reschedule, resp);
>>>>>>> 34570f1 (change of name in controller and manager)
    } catch (e) {
        console.log(e)
        const status_code = e.statusCode ? e.statusCode : 500
        return resp.status(status_code).send({ status: "Failure", message: e.name })
    }
}