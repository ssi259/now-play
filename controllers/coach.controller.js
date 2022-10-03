import {Coach} from '../models'

export const registerCoach = async (req, res) => {

    
    return res.status(200).send("Coach Register API Called");
}

export const getCoaches = async (req, res) => {
    return res.status(200).send(" get Coaches List")
}