const aws = require("aws-sdk");

aws.config.update({
    accessKeyId: "AKIAY3L35MCRVFM24Q7U",
    secretAccessKey: "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",
    
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