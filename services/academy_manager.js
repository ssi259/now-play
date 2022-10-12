const dbConfig = require("../config/db_config.js");

const Sequelize = require("sequelize");
const models = require("../models");
const academy = require("../models/academy.js");
const { Router } = require("express");
const { router } = require("../app.js");

exports.pre_process_create_academy = async(req,resp)=>{
    const result = await  models.Academy.create({name: req.body.name,phone_number: req.body.phone_number,email: req.body.email,sports_id: req.body.sports_id}).then(function (academy) {
        if (academy) {
            resp.send(academy);
        } else {
            resp.status(200).send('Error in insert new academy');
        }
    });
}
exports.process_create_academy_input_req = async(input_response)=>{
    return input_response
}
exports.post_create_academy_process = async(req,resp,input_response)=>{
    resp.send(input_response)
}