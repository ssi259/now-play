const models = require('../models')

exports.pre_process_notifications = async (req) => {
    return req.user
}
  
exports.process_notifications = async (user) => { 
  let notifications;
  if (user.type == 'player') {
    notifications =  await models.Notification.findAll({
      where: {
        receiver_id: user.user_id,
        receiver_type: 'player'
      },
      order: [['id', 'DESC']]
    })
  }
  else if (user.type == 'coach') {
    notifications =  await models.Notification.findAll({
      where: {
        receiver_id: user.coach_id,
        receiver_type: 'coach'
      },
      order: [['id', 'DESC']]
    })
  }
  const response_data = []
  for (let notification of notifications) {
    const data_obj = notification.dataValues;
    data_obj['data'] = JSON.parse(data_obj['data'])
    data_obj['createdAt'] = ist_formate_date(data_obj['createdAt'])
    response_data.push(data_obj)
  }
  return response_data
}

function ist_formate_date (date) {
  const local_date = new Date(date.getTime() + process.env.IN_UTC_TIMEZONE_OFFSET * 60 * 1000)
  return local_date
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