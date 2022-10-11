const coachManager = require('../services/coach_manager');
const {Coach} = require('../models')

exports.createCoach = async (req, resp) => {
    try {
        const coach = await coachManager.process_create_coach(req, resp);
        return resp.status(200).send({status:"Success",coach:coach})
    } catch (e) {
        resp.status(400).send({"status":"Failure","Details":e.message})
    }
}
