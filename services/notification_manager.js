const models = require('../models')

exports.pre_process_notifications = async (req) => {
    return req.user
}
  
exports.process_notifications = async (user) => { 
  if (user.type == 'player') {
    return await models.Notification.findAll({
      where: {
        user_id: user.user_id,
        user_type: 'player'
      }
    })
  }
  else if (user.type == 'coach') {
    return await models.Notification.findAll({
      where: {
        user_id: user.coach_id,
        user_type: 'coach'
      }
    })
  }
}

exports.post_process_notifications = async (data, resp) => {
  resp.status(200).send({ status: "success", message: "retrieved data successfully", data: data });
}