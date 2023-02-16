const help_and_support_manager = require('../services/help_and_support_manager.js')

exports.get_help_and_support = async (req, resp) => {
    try {
        var input_response = await help_and_support_manager.pre_process_get_help_and_support(req)
        var processed_response = await help_and_support_manager.process_get_help_and_support(input_response)
        await help_and_support_manager.post_process_get_help_and_support(processed_response, resp)
    } catch (e) {
        console.log(e)
        const status_code = e.statusCode ? e.statusCode : 500
        return resp.status(status_code).send({ status: "failure", message: e.name})
    }
}