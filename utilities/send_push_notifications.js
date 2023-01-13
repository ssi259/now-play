
// const admin = require("firebase-admin");
// const serviceAccount = require("../config/rushsports-d2e5a_firebase_adminsdk.json");

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount)
// });

// exports.send_push_notifications = async (tokens , notification) => {
//     const deviceTokens = tokens;
//     const payload = {
//         notification: notification,
//     };
//     admin
//         .messaging()
//         .sendToDevice(deviceTokens, payload)
//         .then((response) => {
//             console.log(`Successfully sent message: ${response}`);
//         })
//         .catch((error) => {
//             console.log(`Error sending message: ${error}`);
//         });
// }