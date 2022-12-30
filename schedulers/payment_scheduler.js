const cron = require('node-cron');
const {process_get_all_enrollments_details } = require('../services/enrollment_manager');
const models = require("../models");



const next_payment_reminder = async () => {
    const enrollments = await process_get_all_enrollments_details()
    enrollments.forEach(enrollment => {
        const {end_date} = enrollment
        const fcm_token = models.User.findOne({where: {id: enrollment.user_id}}).fcm_token;
        const date = new Date(end_date);
        date.setDate(date.getDate() - 2);
        const cronPattern = `${date.getSeconds()} ${date.getMinutes()} ${date.getHours()} ${date.getDate()} ${date.getMonth() + 1} *`;
        cron.schedule(cronPattern, async () => {
            console.log('Please pay your payment for next month to continue your enrollment');
            // firebase.messaging().sendToDevice(fcm_token, {
            //     notification: {
            //         title: 'Please pay your payment for next month to continue your enrollment',
            //         body: 'Please pay your payment for next month to continue your enrollment'
            //     }
            // })
        });
    });
    
}

module.exports = {
    next_payment_reminder
}