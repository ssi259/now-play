const { Coach } = require('../models');

exports.process_create_coach = async (req, resp) => {
    const {
        name, phone_number, email, status, sports_id, experience,
        verified, tier, awards, team_affiliations, about, profile_pic,
        locality, city, state, pincode
    } = req.body;

    if (!phone_number) {
        throw new Error('Phone Number Not Provided');
    }
   
    const coach = await Coach.findOne({
        where: {
            phone_number: phone_number,
        }
    });
    if (coach) {
        return coach
    }
    const newCoach= await Coach.create({
        name, phone_number, email, status, sports_id, experience,
        verified, tier, awards, team_affiliations, about, profile_pic,
        locality, city, state, pincode
    })
    return newCoach;
}