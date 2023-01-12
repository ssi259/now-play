const models = require('../models')

exports.pre_process_notifications = async (req) => {
    return req.user
}
  
exports.process_notifications = async (user) => { 
  if (user.type == 'player') {
    const notifications =  await models.Notification.findAll({
      where: {
        receiver_id: user.user_id,
        receiver_type: 'player'
      }
    })
    return notifications
  }
  else if (user.type == 'coach') {
    const notifications =  await models.Notification.findAll({
      where: {
        receiver_id: user.coach_id,
        receiver_type: 'coach'
      }
    })
    return notifications
  }
}

exports.post_process_notifications = async (data, resp) => {
  resp.status(200).send({ status: "success", message: "retrieved data successfully", data: data });
}

exports.pre_process_update_notifications = async (req) => {
  return  {notification_id: req.query.id, data : req.body}
}

exports.process_update_notifications = async (input_response) => { 
  const {notification_id , data } = input_response
  await models.Notification.update(data,{
    where: {
      id:notification_id
    }
  })
  const notification = models.Notification.findByPk(notification_id)
  return notification
}

exports.post_process_update_notifications = async (resp, data) => {
  const data_obj = data
  data_obj['data'] = JSON.parse(data_obj['data'])
  resp.status(200).send({ status: "success", message: "updated successfully", data: data_obj });
}