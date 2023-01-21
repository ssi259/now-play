const models = require('../models')
const Api400Error = require('./../error/api400Error')
const Api500Error = require('./../error/api500Error')


exports.pre_process_create = async (req) => {
    const {subject, text,is_call_request} = req.body
    if (subject == null || text == null) {
        throw new Api400Error("empty field")
    }
    const complainant_type = req.user.type
    const complainant_id = req.user.type =="player" ? req.user.user_id : req.user.coach_id
    return {complainant_id,complainant_type,subject,text,is_call_request }
}

exports.process_create = async(input_response) => {
    const { complainant_id, complainant_type, subject,text,is_call_request } = input_response
    const complaint = await models.Complaint.create({
        complainant_id,
        complainant_type,
        subject,
        text,
        is_call_request
    })
    return complaint
}

exports.post_process_create = async (data, resp) => {
    resp.status(201).send({status:"success",message:"complaint created", data:data})
}


exports.pre_process_get = async (req) => {
    return req
}

exports.process_get = async() => {
    const complaints = await models.Complaint.findAll()
    const resp_complaints = await Promise.all(complaints.map(async (complaint) => {
        complaint = complaint.toJSON()
        await models.User.findByPk(complaint.complainant_id).then(user => { complaint.complainant_name=user.name,complaint.complainant_PhoneNumber=user.phoneNumber})
        if(complaint.complainant_name==null) complaint.complainant_name="null" 
        if(complaint.complainant_PhoneNumber==null) complaint.complainant_PhoneNumber="null"
        return complaint
    }))
    return resp_complaints
}

exports.post_process_get = async (data, resp) => {
    resp.status(200).send({status:"success",message:"data retrieved successfully", data:data})
}

exports.pre_process_update = async (req) => {
    const id = req.params.id
    const body = req.body
    return {id,body}
}

exports.process_update = async({id,body}) => {
    const complaint = await models.Complaint.update(body, {
        where: {
            id: id}
    })
}

exports.post_process_update = async (data, resp) => {
    resp.status(200).send({status:"success",message:"complaint updated", data:data})
}
