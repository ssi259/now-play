const dbConfig = require("../config/db_config.js");

const Sequelize = require("sequelize");
const models = require("../models");
const sport = require("../models/sports.js");
const { Router } = require("express");
const { router } = require("../app.js");

exports.pre_process_create_sport = async(req,resp)=>{
    const result = await  models.Sport.create({name: req.body.name,type: req.body.type,thumbnail: req.body.thumbnail,about: req.body.about}).then(function (sport) {
        if (sport) {
            resp.send(sport);
        } else {
            resp.status(200).send('Error in insert new sport');
        }
    });
}
exports.process_sport_input_req = async(input_response)=>{
    return input_response
}
exports.post_create_sport_process = async(req,resp,input_response)=>{
    resp.send(input_response)
}