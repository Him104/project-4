const aws = require("aws-sdk");

// const multer = require('multer');
// const multerS3 = require('multer-s3');
aws.config.update({
    accessKeyId:process.env.ACCESS_KEY,
    secretAccessKey:process.env.ACCESS_SECRET,
    region:process.env.REGION,
    
  })
  
  let uploadFile= async ( file) =>{
    return new Promise( function(resolve, reject) {
     // this function will upload file to aws and return the link
     let s3 = new aws.S3({apiVersion:"2006-03-01"}); // we will be using the s3 service of aws
  
     var uploadParams= {
      ACL: "public-read",
         Bucket:process.env.BUCKET_NAME,  
         Key: "abc/" + file.originalname, 
         Body: file.buffer
     }
  
     s3.upload( uploadParams, function (err, data ){
         if(err) {
             return reject({"error": err})
         }

         console.log(data)
         console.log("file uploaded succesfully")
          return resolve(data.Location)
     })
  
    })
  }
  module.exports = { uploadFile}