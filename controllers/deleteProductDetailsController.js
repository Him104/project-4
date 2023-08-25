const  productModel = require("../models/productModel");
const deleteProduct = async function(req,res){
try {
    let productId = req.params.productId;
    const product = await productModel.findById(productId);
    if (!product) { 
      
      return res
        .status(400)
        .send({ status: false, msg: "No product Found!" });
    }
    if (product.isDeleted == true) {
        return res
          .status(400)
          .send({ status: false, message: "product has already been deleted" });
      }
  
      const deletedproduct = await productModel.findByIdAndUpdate(
      productId,
        { $set: { isDeleted: true } },
        { new: true }
      );
  
    return res
      .status(201)
      .send({ status: true, msg: "Product deleted successfully"});
   
  } catch (error) {
    res.status(500).send({ status: false, error: error.msg });
  }
};

module.exports.deleteProduct = deleteProduct;






