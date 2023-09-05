const cartModel = require("../models/cartModel.js");
const userModel = require("../models/userModel.js");
const productModel = require("../models/productModel.js");
const mongoose = require("mongoose"); 

 //***********************//
  
 const deleteCart = async function (req, res) {
    try {
        let userId = req.params.userId
       
       //==validating userId==//
   var ObjectId = require('mongoose').Types.ObjectId;
   if (ObjectId.isValid(userId) == false) {

     return res.status(400).send({status: false, msg: "Enter a Valid UserId"});
   }

     let findUserId = await userModel.findById({ _id: userId })
     if (!findUserId) {
       return res.status(404).send({ status: false, msg: "user not found" });
      }
  
  
        const isCartExist = await cartModel.findOne({ userId: userId })
        if (!isCartExist) return res.status(404).send({ status: false, message: "cart does not exist..." })
  
        const cartDeleted = await cartModel.findOneAndUpdate({ _id: isCartExist._id }, { items: [], totalPrice: 0, totalItems: 0 }, { new: true })
        //console.log(cartDeleted)
        return res.status(200).send({ status: true, message: "your cart is empty..continue shopping", data: cartDeleted })
    }
    catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }
  }

  module.exports.deleteCart =deleteCart;