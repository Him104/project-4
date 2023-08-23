const aws = require("aws-sdk");

aws.config.update({
    accessKeyId: "AKIA4DY2WFBASIK46R5I",
    secretAccessKey: "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",
    region: "ap-south-1",
    
  })
  
  let uploadFile= async ( file) =>{
    return new Promise( function(resolve, reject) {
     // this function will upload file to aws and return the link
     let s3 = new aws.S3({apiVersion: '2006-03-01'}); // we will be using the s3 service of aws
  
     var uploadParams= {
        ACL:'public-read',
         Bucket: "him104-aws",  
         Key: "abc/" + file.originalname, 
         Body: file.buffer
     }
  
     s3.upload( uploadParams, function (err, data ){
         if(err) {
             return reject({"error": err})
         }
         console.log(data);
         console.log("file uploaded successfully");
          return resolve(data.Location)
     })
  
    })
  }
  module.exports = { uploadFile}