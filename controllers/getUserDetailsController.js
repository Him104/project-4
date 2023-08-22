const userModel = require("../models/userModel.js");
const mongoose = require("mongoose");
const getUserDetails = async function (req, res) {
    try {
      let userId = req.params.userId;
      var ObjectId = require('mongoose').Types.ObjectId;
      if (ObjectId.isValid(userId) == false) {

        return res.status(400).send({status: false, msg: "Enter a Valid UserId"});
      }
      
      
      const userDetails = await userModel.findById(userId);
      if (!userDetails) { 
        
        return res
          .status(400)
          .send({ status: false, msg: "No User Found!" });
      }

      return res
        .status(200)
        .send({ status: true, msg: "User profile details", data:userDetails});
     
    } catch (error) {
      res.status(500).send({ status: false, error: error.msg });
    }
  };
  
  module.exports.getUserDetails = getUserDetails;
