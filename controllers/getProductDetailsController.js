const productModel = require("../models/productModel.js");
const mongoose = require("mongoose");

const getProductDetails = async function(req,res){
    
    try {

const query = req.query;

if (Object.keys(query).length==0) {

const allProducts = await productModel.find({isDeleted:false}).sort({ title: 'asc' });


if (allProducts.length !=0 ) {

return res.status(200).send({status:true,data:allProducts})

}

}

if (Object.keys(query).length!=0) {

  query.isDeleted = false;
  const getByQuery = await productModel.find(query).sort({ title: 'asc' });

       if(getByQuery.length !=0){
        return res.status(200).send({status:true , data:getByQuery})
      }

      if (getByQuery.length ==0){
        return  res.status(404).send({ status: false, msg: "No Product found by filter"});
      }


}

  
} catch (error) {
  res.status(500).send({status:false, error:message.error})
   
}
}


const getProductDetailsById = async function (req, res) {
    try {
      let productId = req.params.productId;
      
      
      
      const productDetails = await productModel.findById(productId);
      if (!productDetails) { 
        
        return res
          .status(400)
          .send({ status: false, msg: "No productDetails Found!" });
      }

      return res
        .status(200)
        .send({ status: true, msg: "Product Details", data:productDetails});
     
    } catch (error) {
      res.status(500).send({ status: false, error: error.msg });
    }
  };
  
  module.exports.getProductDetails = getProductDetails;
  module.exports.getProductDetailsById = getProductDetailsById;
