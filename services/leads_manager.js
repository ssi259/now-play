const models = require('../models')
const Api400Error = require('../error/api400Error');

exports.pre_process_create_lead = async (req) => {
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const email_id = req.body.email_id;
    const mobile_number = req.body.mobile_number;
    const description = req.body.description;

    return { first_name, last_name, email_id, mobile_number, description };
}

exports.process_create_lead = async (input_data) => {
    const { first_name, last_name, email_id, mobile_number, description } = input_data;
    if (!first_name) {
        throw new Api400Error("first_name is required");
    }
    if (!last_name) {
        throw new Api400Error("last_name is required");
    }
    if (!email_id) {
        throw new Api400Error("email_id is required");
    }
    if (!mobile_number) {
        throw new Api400Error("mobile_number is required");
    }
    if (!description) {
        throw new Api400Error("description is required");
    }
    const lead = await models.Lead.create({
        first_name,
        last_name,
        email_id,
        mobile_number,
        description
    })
    return lead;
}

exports.post_process_create_lead = async (process_response, resp) => {
    return resp.status(200).send({ status: "Success", message: "Lead Created", data: process_response })
}

exports.pre_process_get_leads = async (req) => {
    return {};
}

exports.process_get_leads = async (input_data) => {
    const leads = await models.Lead.findAll();
    return leads;
}   

exports.post_process_get_leads = async (process_response, resp) => {
    return resp.status(200).send({ status: "Success", message: "Leads Fetched", data: process_response })
}
