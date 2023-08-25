const productModel = require("../models/productModel.js");

const deleteProduct = async function (req,res) {
    try {
      const productId = req.params.productId
  
  
      const product = await productModel.findById(productId);
  if (!product) {
  
    return res.status(404).send({status:false,message:"product not found"})
  
  }
  if (product.isDeleted == true) {
  
    return res.status(400).send({status:false, message: "product has already been deleted"})
    
  }
  
  const deletedProduct = await productModel.findByIdAndUpdate(productId ,
  {$set: {isDeleted:true}}, {new:true})
  
  return res.status(201).send({status:true,msg:"Product deleted successfully"})
  
  
    } catch (error) {
  
      res.status(500).send({status:false,error:error.msg})
    
      
    }
    
  }

  module.exports.deleteProduct=deleteProduct;