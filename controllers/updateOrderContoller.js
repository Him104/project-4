const cartModel = require("../models/cartModel.js");
const userModel = require("../models/userModel.js");
const productModel = require("../models/productModel.js");
const orderModel = require("../models/orderModel.js");
const mongoose = require("mongoose");


//updating order status.
const updateOrder = async (req, res) => {
    try {
        const userId = req.params.userId;
        const requestBody = req.body;
        //const userIdFromToken = req.userId

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
        //extract params
        const { orderId, status } = requestBody;
      
        if (!orderId) {
            return res.status(400).send({status: false, message: `Order doesn't exists for ${orderId}`});
        }

        //verifying does the order belongs to user or not.
        isOrderBelongsToUser = await orderModel.findOne({ userId: userId });
        if (!isOrderBelongsToUser) {
            return res.status(400).send({status: false, message: `Order doesn't belongs to ${userId}`});
        }

        if (!status) {
            return res.status(400).send({status: false, message: "Mandatory paramaters not provided. Please enter current status of the order."});
        }
        // must be either - pending , completed or cancelled.
      if (!(status == "pending" || "completed" || "cancelled")) {
          
        return res.status(400).send({status: false,message: `Status must be among ['pending','completed','cancelled'].`})
      }

        //if cancellable is true then status can be updated to any of te choices.
        if (isOrderBelongsToUser["cancellable"] == true) {
    
                if (isOrderBelongsToUser['status'] == 'pending') {
                    const updateStatus = await orderModel.findOneAndUpdate({ _id: orderId }, {
                        $set: { status: status }
                    }, { new: true })
                    return res.status(200).send({ status: true, message: `Successfully updated the order details.`, data: updateStatus })
                }

                //if order is in completed status then nothing can be changed/updated.
                if (isOrderBelongsToUser['status'] == 'completed') {
                    return res.status(400).send({ status: false, message: `Unable to update or change the status, because it's already in completed status.` })
                }

                //if order is already in cancelled status then nothing can be changed/updated.
                if (isOrderBelongsToUser['status'] == 'cancelled') {
                    return res.status(400).send({ status: false, message: `Unable to update or change the status, because it's already in cancelled status.` })
                }
            
        }
        //for cancellable : false
        if (isOrderBelongsToUser['status'] == "completed") {
            if (status) {
                return res.status(400).send({ status: false, message: `Cannot update or change the status, because it's already in completed status.` })
            }
        }

        if (isOrderBelongsToUser['status'] == "cancelled") {
            if (status) {
                return res.status(400).send({ status: false, message: `Cannot update or change the status, because it's already in cancelled status.` })
            }
        }

        if (isOrderBelongsToUser['status'] == "pending") {
            if (status) {
                if (status == "cancelled") {
                    return res.status(400).send({ status: false, message: `Cannot cancel the order due to Non-cancellable policy.` })
                }
                if (status == "pending") {
                    return res.status(400).send({ status: false, message: `Cannot update status from pending to pending.` })
                }

                const updatedOrderDetails = await orderModel.findOneAndUpdate({ _id: orderId }, { $set: { status: status } }, { new: true })

                return res.status(200).send({ status: true, message: `Successfully updated the order details.`, data: updatedOrderDetails })
               
            }
        }

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
}

module.exports.updateOrder =  updateOrder;
