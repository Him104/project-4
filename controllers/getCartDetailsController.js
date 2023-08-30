const cartModel = require("../models/cartModel.js");
const userModel = require("../models/userModel.js");
const productModel = require("../models/productModel.js");
const mongoose = require("mongoose");

const getCartDetailsById = async function (req,res) {
    try {
        let userId = req.params.userId;

const cartDetails = await cartModel.findById(userId);
    if (!cartDetails) {
        return res
        .status(400)
        .send({ status: false, msg: "No cartDetails Found!" });
    }
    return res
        .status(200)
        .send({ status: true, msg: "cart Details", data:cartDetails});
     
    } catch (error) {
      res.status(500).send({ status: false, error: error.msg });
    }
  };

  module.exports.getCartDetailsById = getCartDetailsById;


  