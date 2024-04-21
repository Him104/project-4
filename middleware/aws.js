const aws = require('aws-sdk');
const config = require('../config/config');

aws.config.update({
  accessKeyId: config.accessKey,
  secretAccessKey: config.accessSecret,
  region: config.region
});

const uploadFile = async (file) => {
  const s3 = new aws.S3({ apiVersion: '2006-03-01' });

  const uploadParams = {

    Bucket: config.bucket, // Use the bucket name from config
    Key: "abc/" + file.originalname,
    Body: file.buffer
  };

  try {
    const data = await s3.upload(uploadParams).promise();
    console.log("File has been successfully uploaded");
    console.log(data);
    return data.Location;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

module.exports = { uploadFile };
