const AWS = require("aws-sdk")
var CONFIG = require("../config/aws_config.json")
const s3 = new AWS.S3({
  accessKeyId: CONFIG.accessKeyId,
  secretAccessKey: CONFIG.secretAccessKey,
})


exports.uploadFile = async(file)=> {
  const blob = file.data
  var response = await s3.upload({
    Bucket: "now-play-files",
    Key: `file_${Date.now()}`,
    Body: blob,
  }).promise();
  console.log("uploaded path "+response.Location)

  return response.Location;
}