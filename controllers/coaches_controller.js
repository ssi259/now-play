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
        var processed_response = await coachManager.process_image_upload_request(req,resp);
    } catch (error) { 
        resp.status(500).send({status:"Failure","Details":error.message})
    }
}