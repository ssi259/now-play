const LeadManager = require('../services/leads_manager');

exports.create_lead = async (req, resp) => {
    try {
        var input_process = await LeadManager.pre_process_create_lead(req);
        var process_response = await LeadManager.process_create_lead(input_process);
        var post_process_response = await LeadManager.post_process_create_lead(process_response, resp);
    } catch (e) {
        const status_code = e.statusCode ? e.statusCode : 500
        return resp.status(status_code).send({ status: "Failure", message: e.name })
    }
}

exports.get_leads = async (req, resp) => {
    try {
        var input_process = await LeadManager.pre_process_get_leads(req);
        var process_response = await LeadManager.process_get_leads(input_process);
        var post_process_response = await LeadManager.post_process_get_leads(process_response, resp);
    } catch (e) {
        const status_code = e.statusCode ? e.statusCode : 500
        return resp.status(status_code).send({ status: "Failure", message: e.name })
    }
}