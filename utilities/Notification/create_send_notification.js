const models = require('../../models')
const {send_push_notifications} = require('../../utilities/send_push_notifications')

exports.new_enrollment = async (input_data) => {
    const { user_id, batch_id, plan_id, coach_id, payment_id } = input_data;
    const user = await models.User.findByPk(user_id)
    const coach = await models.Coach.findByPk(coach_id)
    const batch = await models.Batch.findByPk(batch_id)
    const academy = await models.Academy.findByPk(batch['academy_id'])
    const plan = await models.SubscriptionPlan.findByPk(plan_id)
    const notification = await models.Notification.create({
        sender_id: user['id'],
        sender_type: "player",
        receiver_id: coach['id'],
        receiver_type: "coach",
        type: "new_enrollment",
        title: "New Enrollment",
        body: `${user['name'] != null ? user['name'] : 'New Player'} just requested for enrollment in ${plan['type']} plan in the ${await convert24to12(batch['start_time'])}-${await convert24to12(batch['end_time'])} batch at ${academy['name']}`,
        data: {
          sender: {
            id: user['id'],
            name: user['name'],
            phone_number: user['phoneNumber'],
            profile_pic:user['profilePic'],
          },
          batch: {
            id: batch['id'],
            thumbnail_img: batch['thumbnail_img'],
          },
          plan: {
            id: plan['id'],
            plan_name:plan['plan_name'],
            price: plan['price'],
            tag: plan['tag'],
            type:plan['type']
          },
          payment: {
            id:payment_id
          }
        },
        payment_id:payment_id,
        is_marketing: false,
        is_read:false
    })
  if (coach['fcm_token'] != null) {
    await send_push_notifications(coach['fcm_token'],
      {
        title: notification.title,
        body: notification.body
      }
    )
  }
}

async function convert24to12(time_string) {
    let time12;
    const [hours,minutes] =time_string.split(":"); 
    if (hours > 12) {
        time12 = (hours - 12) + ':' + minutes.substr(-2) + 'PM';
    } else if (hours === 12) {
        time12 = hours + ':' + minutes.substr(-2) + 'PM';
    } else if (hours === 0) {
        time12 = '12:' + minutes.substr(-2) + 'AM';
    } else {
        time12 = hours + ':' + minutes.substr(-2) + 'AM';
    }
    return time12;
}

exports.payment_reminder = async (enrollment_id) => {
  const enrollment = await models.Enrollment.findByPk(enrollment_id)
  const user = await models.User.findByPk(enrollment['user_id'])
  const batch = await models.Batch.findByPk(enrollment['batch_id'])
  const academy = await models.Academy.findByPk(batch['academy_id'])
  const plan = await models.SubscriptionPlan.findByPk(enrollment['subscription_id'])
  const notification = await models.Notification.create(
    {
      sender_id: enrollment['coach_id'],
      sender_type: "coach",
      receiver_id: user['id'],
      receiver_type: "player",
      type: "payment_reminder",
      title: "Payment Reminder",
      body: `Dear ${user['name'] || 'User'}, Your ${plan['type']} plan of Rs.${plan['price']} expires on ${enrollment['end_date'].toLocaleDateString('en-IN', {year:"numeric", month:"short", day:"numeric"})} for your class at ${academy['name']}.Please pay immediately to continue your enrollment`,
      data: {
        enrollment_id: enrollment_id,
        batch_thumbnail_img:batch['thumbnail_img']
      },
      is_marketing: false,
      is_read:false
    }
  )
  if (user['fcm_token'] != null) {
    await send_push_notifications(user['fcm_token'],
      {
        title: notification.title,
        body: notification.body
      }
    )
  }
}

exports.payment_status = async (input_data) => {
  const { enrollment_id, payment_id,coach_resp } = input_data
  const payment = await models.Payment.findByPk(payment_id)
  const enrollment = await models.Enrollment.findByPk(enrollment_id)
  const user = await models.User.findByPk(enrollment['user_id'])
  const batch = await models.Batch.findByPk(enrollment['batch_id'])
  const academy = await models.Academy.findByPk(batch['academy_id'])
  const sport = await models.Sports.findByPk(batch['sports_id'])
  const coach = await models.Coach.findByPk(enrollment['coach_id'])
  const notification = await models.Notification.create(
    {
      sender_id: coach['id'],
      sender_type: "coach",
      receiver_id: user['id'],
      receiver_type: "player",
      type: "payment_status",
      title: `Payment ${coach_resp ? 'Accepted' :'Declined'}`,
      body: `Dear ${user['name'] || 'User'}, your payment of Rs. ${payment['price']} for ${sport['name']} class at ${academy['name']} ${coach_resp ? 'accepted' :'declined'} by ${coach['name']}`,
      data: {
        enrollment_id: enrollment_id,
        batch_thumbnail_img:batch['thumbnail_img']
      },
      is_marketing: false,
      is_read:false
    }
  )
  if (user['fcm_token'] != null) {
    await send_push_notifications(user['fcm_token'],
      {
        title: notification.title,
        body: notification.body
      }
    )
  }
}

exports.class_reschedule = async (input_data) => {
  const { class_data, class_type, coach_id } = input_data
  const batch = await models.Batch.findByPk(class_data['batch_id'])
  const academy = await models.Academy.findByPk(batch['academy_id'])
  const coach = await models.Coach.findByPk(coach_id)
  const enrollments = await models.Enrollment.findAll(
    {
      where: {
        batch_id: class_data['batch_id'],
        status : 'active'
      },
      attributes: ['user_id'],
      group: ['user_id']
    }
  )
  for (let enrollment of enrollments) {
    let user = await models.User.findByPk(enrollment['user_id'])
    const notification = await models.Notification.create(
      {
        sender_id: coach['id'],
        sender_type: "coach",
        receiver_id: user['id'],
        receiver_type: "player",
        type: "class_reschedule",
        title: `Class ${class_type == 'rescheduled' ? 'Rescheduled' : 'Canceled'}`,
        body: `Dear ${user['name'] || 'User'}, your class on ${convertTo12Hour(class_data['previous_start_time']) +", "+ convert_date_IN(class_data['previous_start_date'])} at ${academy['name']} has been ${class_type =='rescheduled' ? `reschduled to ${convertTo12Hour(class_data['updated_start_time']) +", "+ convert_date_IN(class_data['updated_date'])}` : 'canceled'}`,
        data: {
          batch_thumbnail_img: batch['thumbnail_img']
        },
        is_marketing: false,
        is_read: false
      }
    )
    if (user['fcm_token'] != null) {
      await send_push_notifications(user['fcm_token'],
        {
          title: notification.title,
          body: notification.body
        }
      )
    }
  }
}


function convert_date_IN(date) {
  return date.toLocaleDateString('en-IN', {year:"numeric", month:"short", day:"numeric"})
}

function convertTo12Hour(time) {
  let hours = parseInt(time.substr(0, 2));
  let minutes = time.substr(3, 2);
  let ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
}