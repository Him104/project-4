const aws = require("aws-sdk");

aws.config.update({
    accessKeyId: "adding soon",
    secretAccessKey: "adding soon",
    
  })
  
  let uploadFile= async ( file) =>{
    return new Promise( function(resolve, reject) {
     // this function will upload file to aws and return the link
     let s3= new aws.S3(); // we will be using the s3 service of aws
  
     var uploadParams= {
        
         Bucket: "him104-aws",  
         Key: "abc/" + file.originalname, 
         Body: "uploading images"
     }
  
     s3.upload( uploadParams, function (err, data ){
         if(err) {
             return reject({"error": err})
         }
          return resolve(data.Location)
     })
  
    })
  }
  module.exports = { uploadFile}