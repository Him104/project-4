const aws = require("aws-sdk");

// const multer = require('multer');
// const multerS3 = require('multer-s3');
aws.config.update({
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.ACCESS_SECRET,
    region: process.env.REGION
    
  })
  
  const uploadFile= async ( file) =>{
   
     const s3 = new aws.S3({apiVersion:'2006-03-01'}); // we will be using the s3 service of aws
  
     const uploadParams= {
        ACL:"public-read",
         Bucket: "him104",  
         Key: "abc/" + file.originalname, 
         Body: file.buffer
     }
  try {
   const data =await s3.upload( uploadParams).promise();

      console.log("file has been successfully uploaded")
      console.log(data);
       return data.Location;
    
  } catch (error) {
    
    console.error("error uploading file:",error);
    throw error;
  }
  }
   
  module.exports = { uploadFile};