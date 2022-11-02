const coachManager = require('../services/coach_manager');

exports.createCoach = async (req, resp) => {
    try {
        var process_response = await coachManager.process_create_coach(req, resp);
    } catch (e) {
        resp.status(500).send({status:"Failure",details:e.message})
    }
}

exports.uploadCoachImages = async (req, resp) => {
    try {
        var input_response = await coachManager.pre_process_image_upload_request(req)
        await coachManager.process_image_upload_request(input_response);
        await coachManager.post_process_image_upload_request(resp)
    } catch (e) {
        const status_code = e.statusCode ? e.statusCode : 500
        resp.status(status_code).send({ status: "Failure", message: e.name })
    }
}

exports.uploadCoachDocuments = async (req, resp) =>{
    try {
        var input_response = await coachManager.pre_process_document_upload_request(req)
        await coachManager.process_document_upload_request(input_response);
        await coachManager.post_process_document_upload_request(resp)
    } catch (e) { 
        const status_code = e.statusCode ? e.statusCode : 500
        resp.status(status_code).send({status:"Failure",message:e.name})
    }
}

exports.getCoaches = async (req, resp) => {
    try {
        var process_response = await coachManager.process_get_coaches()
        var post_process_response = await coachManager.post_process_get_coaches(process_response,resp)
    } catch (e) {
        const status_code = e.statusCode ? e.statusCode : 500
        resp.status(status_code).send({status:"Failure",message:e.name})
    }
}

exports.getCoachById = async (req, resp) => {
    try {
        var input_response = await coachManager.pre_process_get_coach_by_id(req)
        var process_response = await coachManager.process_get_coach_by_id(input_response)
        var post_process_response = await coachManager.post_process_get_coach_by_id(process_response,resp)
    } catch (e) {
        const status_code = e.statusCode ? e.statusCode : 500
        resp.status(status_code).send({status:"Failure",message:e.name})
    }
}

exports.update_coach_by_id = async (req, resp) => {
    try {
        var input_response = await coachManager.pre_process_update_coach_by_id(req)
        await coachManager.process_update_coach_by_id(input_response)
        await coachManager.post_process_update_coach_by_id(resp)
    } catch (e) {
        const status_code = e.statusCode ? e.statusCode : 500
        resp.status(status_code).send({status:"failure",message:e.name})
    }
}