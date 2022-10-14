const AWS = require("aws-sdk")
var fs = require('fs');
const s3 = new AWS.S3({
  accessKeyId: "AKIA3YMRWBGNQNVB2XWD",
  secretAccessKey: "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",
})

    
exports.uploadedImage = async(file)=> {
  console.log("inside upload image")
  const blob = file.data
  await s3.upload({
  Bucket: "now-play-files",
  Key: `image_${Date.now()}`,
  Body: blob,
}).promise()
}
