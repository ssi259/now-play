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