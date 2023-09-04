const cartModel = require("../models/cartModel.js");
const userModel = require("../models/userModel.js");
const mongoose = require("mongoose");


const getCart = async function (req, res) {
    try {
        const userId = req.params.userId;
        var ObjectId = require('mongoose').Types.ObjectId;
      if (ObjectId.isValid(userId) == false) {

        return res.status(400).send({ status: false, message: "UserId is invalid" })
      }
      
  
        const getUser = await userModel.findOne({_id : userId })
        if (!getUser) return res.status(404).send({ status: false, message: "User not found" })
        
        const getData = await cartModel.findOne({ userId: userId  })
        //.populate("items.productId")
        if (!getData) return res.status(404).send({ status: false, message: "Cart not found" })
  
        return res.status(200).send({ status: true, message: "cart details", data: getData })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
  }

  module.exports.getCart = getCart;


  