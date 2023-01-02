const cron = require('node-cron');
const {get_upcoming_classes} = require('../controllers/batches_controller');
const models = require("../models");

const upcoming_class_reminder = async () => {
    const user_enrollments = await models.Enrollment.findAll()
    user_enrollments.map(async (enrollment) => {
        enrollment = enrollment.toJSON();
        const {batch_id, user_id} = enrollment;
        console.log(batch_id, user_id)
        const {days,start_time,start_date,end_date} = await models.Batch.findOne({where: {id: batch_id}});
        const {fcm_token} = await models.User.findOne({where: {id: user_id}});
        const cron_pattern = `0 0 ${start_time.getHours() - 2} * * ${days.map(day => day + 1).join(',')}`;
        
        cron.schedule(cron_pattern, async () => {
            // send a notification to the user with the fcm_token
        })
    })
}

module.exports = {
    upcoming_class_reminder
}