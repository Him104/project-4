const cartModel = require("../models/cartModel.js");
const userModel = require("../models/userModel.js");
const productModel = require("../models/productModel.js");
const mongoose = require("mongoose");

const addToCart = async function (req, res) { 
    try {
      let {items,totalPrice,totalItems} = req.body;

      let userId = req.params.userId;
      var ObjectId = require('mongoose').Types.ObjectId;
      if (ObjectId.isValid(userId) == false) {

        return res.status(400).send({status: false, msg: "Enter a Valid UserId"});
      }
      
      
      const userDetails = await userModel.findById(userId);
      if (!userDetails) { 
        
        return res
          .status(400)
          .send({ status: false, msg: "No User Found! Please Add a valid UserId" });
      }
      
      if (!items[0].productId) {
        return res
          .status(400)
          .send({ status: false, msg: "productId is required field Please Provide a Product Id" });
      }
      if (ObjectId.isValid(items[0].productId) == false) {

        return res.status(400).send({status: false, msg: "Enter a Valid productId"});
      }

      const productDetails = await productModel.findById(items[0].productId);
      if (!productDetails) { 
        
        return res
          .status(400)
          .send({ status: false, msg: "No Product Found! Please Select a Product in Cart" });
      }

      if (!items[0].quantity) {
        return res
          .status(400)
          .send({ status: false, msg: "No one Product added in Cart" });
      }
      if (!totalPrice) {
        return res
          .status(400)
          .send({ status: false, msg: "totalPrice is missing Please add this" });
      }
      if (!totalItems) {
        return res
          .status(400)
          .send({ status: false, msg: "totalItems is missing Please add this" });
      }
      req.body.userId = userId;    
  
      let createdcart = await cartModel.create(req.body);
      res
        .status(201)
        .send({
          status: true,
          message: "Product Addedin Cart successfully",
          data: createdcart,
        });
      }

      catch (error) {
      return res.status(500).send({ msg: error.message });
    }

}


  

  module.exports.addToCart = addToCart;