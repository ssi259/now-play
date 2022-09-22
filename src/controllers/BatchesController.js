const {Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/sequelize');
const BatchModel = require('../../models/batch'); // import models
const allBatches = async(req,resp)=>{
    await sequelize.query("SELECT id, coach , sports, (6371 *acos(cos(radians("+ req.query.lat + ")) * cos(radians(lat)) * cos(radians(lng) - radians("+req.query.lng+")) + sin(radians("+req.query.lat+")) * sin(radians(lat)))) AS distance FROM Batches HAVING distance < 610   ORDER BY distance LIMIT 0, 20;",{ type: Sequelize.QueryTypes.SELECT }).then((result)=>{
        resp.send(result)
    }).catch((err)=>{
        console.log(err)
    })
}
const createBatches = async(req,resp)=>{
    console.log(req.body.lat)
    const user = await BatchModel.Batch.create({
    id: req.body.id,
    sports: req.body.sports,
    coach: req.body.coach,
    lat: req.body.lat, 
    lng: req.body.lng
    }).then(()=>{
        resp.send()

    }).catch(error=>{
        console.log(error)
    })
}
module.exports={
    allBatches,createBatches
}