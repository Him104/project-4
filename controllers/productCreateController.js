const productModel = require("../models/productModel.js");

const createProduct = async function (req, res) {
    try {
      //let data = req.body;
      let {title, description, price, currencyId, currencyFormat, productImage, style, availableSizes, installments} = req.body;
      
      if (!title) {
        return res
          .status(400)
          .send({ status: false, msg: "title is required field" });
      }
      if (!description) {
        return res.status(400).send({ status: false, msg: "description is required" });
      }

      if (!price) {
        return res.status(400).send({ status: false, msg: "price is required" });
      }

    if (!currencyId) {
      return res.status(400).send({status:false,msg:"currencyId is required"})
  }
      
      // if (!currencyFormat) {
      //   return res.status(400).send({ status: false, msg: "currencyFormat is required" });
      // }

      if (!productImage) {
        return res.status(400).send({ status: false, msg: "productImage is required" });
      }

      if (!availableSizes) {
        return res.status(400).send({ status: false, msg: "availableSizes is required" });
      }
     
      const duplicateProductTitle = await productModel.findOne({title: title});
  
      if (duplicateProductTitle) {
        return res
          .status(400)
          .send({ status: false, msg: "Product Title  already exists" });
      }
     
      
      
          
      let createdProduct = await productModel.create(req.body);
      res
        .status(201)
        .send({
          status: true,
          message: "Product created successfully",
          data: createdProduct,
        });
      }

      catch (error) {
      return res.status(500).send({ msg: error.message });
    }

}


  

  module.exports.createProduct = createProduct;