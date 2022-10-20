const coachManager = require('../services/coach_manager');

exports.createCoach = async (req, resp) => {
    try {
        const coach = await coachManager.process_create_coach(req, resp);
        return resp.status(200).send({status:"Success",coach:coach})
    } catch (e) {
        return resp.status(400).send({"status":"Failure","Details":e.message})
    }
}

exports.uploadCoachImages = async (req, resp) =>{
    try {
        var processed_response = await coachManager.process_image_upload_request(req,resp);
    } catch (error) { 
        resp.status(500).send({status:"Failure","Details":error.message})
    }
}