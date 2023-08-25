const productModel = require("../models/productModel");
const mongoose = require("mongoose");

const updateProduct = async function(req,res){
    try {
  
      let data = req.body;
  
      let productId = req.params.productId;

     let checkProductId =  mongoose.isValidObjectId(productId); 

     if(checkProductId == false){

      return res.status(400).send({status:false, message: "Please enter a valid ProductId"});
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
      
      
      
      

     const updateProduct = await productModel.findOneAndUpdate({_id:productId},
    {$set:req.body},
    {new:true})
  
    return res.status(200).send({status:true,message:"Product details updated successfully", data:updateProduct})
  
  
  
      
    } catch (error) {
      res.status(500).send({status:false, error:error.message})
    }
  }

  module.exports.updateProduct=updateProduct;