const productModel = require("../models/productModel.js");
const mongoose = require("mongoose");


const getProduct = async function (req, res) {
  try {
    const requestQuery = req.query
    const { size, name, priceGreaterThan, priceLessThan, priceSort } = requestQuery
    const filterQuery = { isDeleted: false }

    if (Object.keys(requestQuery).length == 0) {

      const findProducts = await productModel.find({ isDeleted: false }).sort({ title: 'asc' });


      if (findProducts.length != 0) {

        return res.status(200).send({ status: true, count: findProducts.length, data: findProducts })

      }

    }

    if (Object.keys(requestQuery).length > 0) {
      if (size) {
        let size1 = size.split(",").map(x => x.trim().toUpperCase())
        //if (size1.map(x => isValidSize(x)).filter(x => x === false).length !== 0) return res.status(400).send({ status: false, message: "Size Should be among  S,XS,M,X,L,XXL,XL" })
        filterQuery.availableSizes = { $in: size1 }
      }

      if (name) {
        let findTitle = await productModel.find()
        let fTitle = findTitle.map(x => x.title).filter(x => x.includes(name))

        if (fTitle.length == 0) { filterQuery.title = name }
        filterQuery.title = { $in: fTitle }
      }

      if (priceSort) {
        if (priceSort != 1 && priceSort != -1) return res.status(400).send({ status: false, message: "priceSort should be among 1 and -1." })
      }

      if (priceGreaterThan && priceLessThan) { filterQuery.price = { $gt: priceGreaterThan, $lt: priceLessThan } }
      if (priceGreaterThan && !priceLessThan) { filterQuery.price = { $gt: priceGreaterThan } }
      if (priceLessThan && !priceGreaterThan) { filterQuery.price = { $lt: priceLessThan } }
    }

    const findProducts = await productModel.find(filterQuery).sort({ price: priceSort })

    if (findProducts.length == 0) return res.status(404).send({ status: false, message: "products not found or may be deleted" })

    return res.status(200).send({ status: true, count: findProducts.length, message: "products details", data: findProducts })
  }
  catch (err) {
    return res.status(500).send({ status: false, error: err.message })
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
      .send({ status: true, msg: "Product Details", data: productDetails });

  } catch (error) {
    res.status(500).send({ status: false, error: error.msg });
  }
};

module.exports.getProduct = getProduct;
//module.exports.getProductDetails = getProductDetails;
module.exports.getProductDetailsById = getProductDetailsById;
