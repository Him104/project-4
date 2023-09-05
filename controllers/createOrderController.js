const cartModel = require("../models/cartModel.js");
const userModel = require("../models/userModel.js");
const productModel = require("../models/productModel.js");
const orderModel = require("../models/orderModel.js");
const mongoose = require("mongoose");


//Creating order
const orderCreation = async (req, res) => {
  try {
      const userId = req.params.userId;
      const requestBody = req.body;
      //const userIdFromToken = req.userId;
       
//==validating userId==//
var ObjectId = require('mongoose').Types.ObjectId;
if (ObjectId.isValid(userId) == false) {

  return res.status(400).send({status: false, msg: "Enter a Valid UserId"});
}

  let findUserId = await userModel.findById({ _id: userId })
  if (!findUserId) {
    return res.status(404).send({ status: false, msg: "user not found" });
   }

      //==validating request body==//
      if (Object.keys(requestBody).length == 0) { 
        return res.status(400).send({ status: false, message: 'No data provided' })

       }
      //Extract parameters
      const { cartId, cancellable, status } = requestBody;

      if (!cartId) {
          return res.status(400).send({status: false, message: `Cart doesn't exists for ${userId}`});
      }
      if (ObjectId.isValid(cartId) == false) {

        return res.status(400).send({status: false, msg: "Enter a Valid cartId"});
      }

      //searching cart to match the cart by userId whose is to be ordered.
      const searchCartDetails = await cartModel.findOne({_id: cartId, userId: userId});
      if (!searchCartDetails) {
          return res.status(400).send({status: false,message: `Cart doesn't belongs to ${userId}`});
      }

      //must be a boolean value.
      if (cancellable) {
          if (typeof cancellable != "boolean") {
              return res.status(400).send({status: false,message: `Cancellable must be either 'true' or 'false'.`})}
      }

      // must be either - pending , completed or cancelled.
      if (!(status == "pending" || "completed" || "cancelled")) {
          
              return res.status(400).send({status: false,message: `Status must be among ['pending','completed','cancelled'].`})
            }

      

      //verifying whether the cart is having any products or not.
      if (!searchCartDetails.items.length) {
          return res.status(202).send({status: false, message: `Order already placed for this cart. Please add some products in cart to make an order.`});
      }

      //adding quantity of every products
      const reducer = (previousValue, currentValue) => previousValue + currentValue;

      let totalQuantity = searchCartDetails.items.map((x) => x.quantity).reduce(reducer);

      //object destructuring for response body.
      const orderDetails = {
          userId: userId,
          items: searchCartDetails.items,
          totalPrice: searchCartDetails.totalPrice,
          totalItems: searchCartDetails.totalItems,
          totalQuantity: totalQuantity,
          cancellable,
          status,
      };
      const savedOrder = await orderModel.create(orderDetails);

      //Empty the cart after the successfull order
      await cartModel.findOneAndUpdate({ _id: cartId, userId: userId }, {
          $set: {
              items: [],
              totalPrice: 0,
              totalItems: 0,
          }});
      return res.status(200).send({ status: true, message: "Order placed.", data: savedOrder });
  } catch (err) {
      return res.status(500).send({ status: false, message: err.message });
  }
};



  module.exports.orderCreation = orderCreation;

