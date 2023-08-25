const aws = require("aws-sdk");

// const multer = require('multer');
// const multerS3 = require('multer-s3');
aws.config.update({
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.ACCESS_SECRET,
    region: process.env.REGION
    
  })
  
  let uploadFile= async ( file) =>{
    return new Promise( function(resolve, reject) {
     // this function will upload file to aws and return the link
     let s3 = new aws.S3(); // we will be using the s3 service of aws
  
     var uploadParams= {
        
         Bucket: "him104",  
         Key: "abc/" + file.originalname, 
         Body: file.buffer
     }
  
     s3.upload( uploadParams, function (err, data ){
         if(err) {
             return reject({"error": err})
         }

         console.log("file has been successfully uploaded")
         console.log(data);
          return resolve(data.Location)
     })
  
    })
  }
  module.exports = { uploadFile}