import {Coach} from '../models'

export const registerCoach = async (req, res) => {
    try {
        const {
          name, contactNumber, email, address, status, sportsName, experience, verified, tier, awards, teamAffiliations,about
        } = req.body;
        const coach = await Coach.findOne({
          where: { contactNumber },
        });
        if (coach) {
          throw new Error('User already exists with same email');
        }
        const payload = {
            name,
            contactNumber,
            email,
            address,
            status,
            sportsName,
            experience,
            verified,
            tier,
            awards,
            teamAffiliations,
            about
          }
        const newCoach = await Coach.create(payload);
        return res.status(200).send({coach:newCoach})
      } catch (error) {
        return res.status(400).send(error.message);
    }
}

export const getCoaches = async (req, res) => {
    try {
        const coaches = await Coach.findAll();
        return res.status(200).send({coachesList:coaches})
        
    } catch (err) {
        return res.status(400).send(error.message);
    }
}