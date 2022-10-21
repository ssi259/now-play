const coachManager = require('../services/coach_manager');

exports.createCoach = async (req, resp) => {
    try {
        var process_response = await coachManager.process_create_coach(req, resp);
    } catch (e) {
        resp.status(500).send({status:"Failure",details:e.message})
    }
}

exports.uploadCoachImages = async (req, resp) =>{
    try {
        var input_response = await coachManager.pre_process_image_upload_request(req)
        await coachManager.process_image_upload_request(input_response);
        await coachManager.post_process_image_upload_request(resp)
    } catch (e) { 
        const status_code = e.statusCode ? e.statusCode: 500
        resp.status(status_code).send({status:"Failure",message:e.name})
    }
}