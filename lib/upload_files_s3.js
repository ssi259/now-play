const AWS = require("aws-sdk")
var CONFIG = require("../config/aws_config.json")
const s3 = new AWS.S3({
  accessKeyId: CONFIG.accessKeyId,
  secretAccessKey: CONFIG.secretAccessKey,
})

    
exports.uploadedImage = async(file)=> {
  const blob = file.data
  await s3.upload({
  Bucket: "now-play-files",
  Key: `file_${Date.now()}`,
  Body: blob,
}).promise()
}
