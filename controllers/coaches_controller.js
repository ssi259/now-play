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


exports.get_payments_monthly = async (req, resp) => {
    try {
        const  input_response = await coachManager.pre_process_get_monthly_payments(req)
        const process_response = await coachManager.process_get_monthly_payments(input_response)
        await coachManager.post_process_get_monthly_payments(process_response,resp)
    } catch (e) {
        console.log(e)
        const status_code = e.statusCode ? e.statusCode : 500
        resp.status(status_code).send({status:"failure",message:e.name, data:{}})
    }
}
exports.getCoachBatches = async (req, resp) => {
    try {
        var input_response = await coachManager.pre_process_get_coach_batches(req)
        var process_response = await coachManager.process_get_coach_batches(input_response)
        var post_process_response = await coachManager.post_process_get_coach_batches(resp,process_response)
    } catch (e) {
        console.log(e)
        const status_code = e.statusCode ? e.statusCode : 500
        resp.status(status_code).send({status:"Failure",message:e.name})
    }
}
exports.get_payments_by_status = async (req, resp) => {
    try {
        const input_response = await coachManager.pre_process_get_payments_by_status(req)
        const process_response = await coachManager.process_get_payments_by_status(input_response)
        await coachManager.post_process_get_payments_by_status(process_response, resp)
    }
    catch (e) {
        const status_code = e.statusCode ? e.statusCode : 500
        resp.status(status_code).send({status:"failure",message:e.name, data:{}})
    }
}

exports.getCoachEnrolledStudents = async (req, resp) => {
    try {
        var input_response = await coachManager.pre_process_get_coach_enrolled_students(req)
        var process_response = await coachManager.process_get_coach_enrolled_students(input_response)
        var post_process_response = await coachManager.post_process_get_coach_enrolled_students(resp,process_response)
    } catch (e) {
        console.log(e)
        const status_code = e.statusCode ? e.statusCode : 500
        resp.status(status_code).send({status:"failure",message:e.name, data:{}})
    }
}

exports.get_enrolled_users_list = async (req, resp) => {
    try {
        const input_response = await coachManager.pre_process_get_enrolled_users_list(req)
        const process_response = await coachManager.process_get_enrolled_users_list(input_response)
        await coachManager.post_process_get_enrolled_users_list(resp,process_response)
    } catch (e) {
        console.log(e)
        const status_code = e.statusCode ? e.statusCode : 500
        resp.status(status_code).send({status:"failure",message:e.name})
    }
}

exports.update_profile_pic = async (req, resp) => {
    try {
        var input_response = await coachManager.pre_process_update_profile_pic(req)
        var processed_response = await coachManager.process_update_profile_pic(input_response)
        await coachManager.post_process_update_profile_pic(processed_response,resp)
    } catch (e) {
        const status_code = e.statusCode ? e.statusCode : 500
        return resp.status(status_code).send({ status: "failure", message: e.name,data:{}})
    }
}

exports.get_batch_details = async (req, resp) => {
    try {
        var input_response = await coachManager.pre_process_get_batch_details(req)
        var processed_response = await coachManager.process_get_batch_details(input_response)
        await coachManager.post_process_get_batch_details(processed_response,resp)
    } catch (e) {
        const status_code = e.statusCode ? e.statusCode : 500
        return resp.status(status_code).send({ status: "failure", message: e.name,data:{}})
    }
}

exports.get_coach_earnings = async (req, resp) => {
    try {
        var input_response = await coachManager.pre_process_get_coach_earnings(req)
        var process_response = await coachManager.process_get_coach_earnings(input_response)
        var post_process_response = await coachManager.post_process_get_coach_earnings(resp,process_response)
    } catch (e) {
        console.log(e)
        const status_code = e.statusCode ? e.statusCode : 500
        resp.status(status_code).send({status:"failure",message:e.name, data:{}})
    }
}

exports.get_coach_details = async (req, resp) => {
    try {
        var input_response = await coachManager.pre_process_get_coach_details(req)
        var process_response = await coachManager.process_get_coach_details(input_response)
        var post_process_response = await coachManager.post_process_get_coach_details(resp,process_response)
    } catch (e) {
        console.log(e)
        const status_code = e.statusCode ? e.statusCode : 500
        resp.status(status_code).send({status:"failure",message:e.name, data:{}       })
    }
}

exports.get_upcoming_classes = async (req, resp) => {
    try {
        const input_response = await coachManager.pre_process_upcoming_classes(req)
        const process_response = await coachManager.process_upcoming_classes(input_response)
        await coachManager.post_process_upcoming_classes(resp,process_response)
    } catch (e) {
        console.log(e)
        const status_code = e.statusCode ? e.statusCode : 500
        resp.status(status_code).send({status:"failure",message:e.name, data:{}})
    }
}