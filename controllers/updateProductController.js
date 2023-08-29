const productModel = require("../models/productModel");
const mongoose = require("mongoose");
let aws = require('../middleware/aws.js');

const updateProduct = async function(req,res){
    try {
  
      let data = req.body;
  
      let productId = req.params.productId;

     let checkProductId =  mongoose.isValidObjectId(productId); 

     if(checkProductId == false){

      return res.status(400).send({status:false, message: "Please enter a valid ProductId"});
     }

     if (Object.keys(req.body).length === 0) {
      return res.status(400).send({status:false, message: "Please enter at least one updated filed of ProductId"});
   }
  
  
      const product = await productModel.findById(productId);
  
      if (!product) {
  
        return res.status(400).send({status:false, message: "Please enter valid product id"})
        
      }
      if (product.isDeleted==true) {
      
        return res.status(400).send({status:false, message:"product has already been deleted"});
        
      }

      const duplicateTitle = await productModel.findOne({ title: data.title });
  
      if (duplicateTitle) { 
        return res
          .status(400)
          .send({ status: false, msg: "This Title already exists Please Choose Other" }); 
      }
      
      let files = req.files;
if (files && files.length>0) {
  let uploadedFileURL = await aws.uploadFile(files[0])
  productImage = uploadedFileURL}
  else{
    res.status(400).send({msg:"No file found"})
  }
      
      

     const updateProduct = await productModel.findOneAndUpdate({_id:productId},
    {$set:req.body,productImage:productImage},
    {new:true})
  
    return res.status(200).send({status:true,message:"Product details updated successfully", data:updateProduct})
  
  
  
      
    } catch (error) {
      res.status(500).send({status:false, error:error.message})
    }
  }

  module.exports.updateProduct=updateProduct;