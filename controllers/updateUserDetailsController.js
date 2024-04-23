const userModel = require("../models/userModel.js");
const mongoose = require("mongoose");
const validator = require('validator');
const config = require('../config/config')

const updateUserDetails = async function(req,res){
    try {
  
      let data = req.body;
  
      let userId = req.params.userId;

     let checkuserId =  mongoose.isValidObjectId(userId); 

     if(checkuserId == false){

      return res.status(400).send({status:false, message: "Please enter a valid userId"});
     }
  
     if (!data.fname) {
        return res
          .status(400)
          .send({ status: false, msg: "fname is required field" });
      }
      if (!data.lname) {
        return res.status(400).send({ status: false, msg: "lname name is required" });
      }

      if (!data.email) {
        return res.status(400).send({ status: false, msg: "email is required" });
      }


  const validEmail = validator.isEmail(data.email)
    if (!validEmail) {
      return res.status(400).send({status:false,msg:"email is not valid"})
      
    
  }
      const duplicateEmail = await userModel.findOne({ email: data.email });
  
      if (duplicateEmail) {
        return res
          .status(400)
          .send({ status: false, msg: "email already exists" });
      }

      if (!data.profileImage) {
        return res.status(400).send({ status: false, msg: "profileImage is required" });
      }

      if (!data.phone) {
        return res.status(400).send({ status: false, msg: "phone is required" });
      }
      if (!(data.phone.length == 10)) {
        return res.status(400).send({ status: false, msg: "phone no must be 10 digit" });
      }

      const duplicatePhone = await userModel.findOne({ phone: data.phone });
  
      if (duplicatePhone) {
        return res
          .status(400)
          .send({ status: false, msg: "Phone already exists" });
      }
      
      if (!data.password) {
        return res
          .status(400)
          .send({ status: false, msg: "password is required" });
      }
  
      if (!(data.password.length > 8 && data.password.length < 15)) {
        return res
          .status(400)
          .send({
            status: false,
            msg: "password length should be between 8 to 15 characters",
          });
      }

      if (!data.address.shipping.street) {
        return res.status(400).send({ status: false, msg: "Address Shipping street is required" });
      }
      if (!data.address.shipping.city) {
        return res.status(400).send({ status: false, msg: "Address Shipping city is required" });
      }
      if (!data.address.shipping.pincode) {
        return res.status(400).send({ status: false, msg: "Address Shipping pincode is required" });
      }

      if (!data.address.billing.street) {
        return res.status(400).send({ status: false, msg: "Address billing street is required" });
      }
      if (!data.address.billing.city) {
        return res.status(400).send({ status: false, msg: "Address billing city is required" });
      }
      if (!data.address.billing.pincode) {
        return res.status(400).send({ status: false, msg: "Address billing pincode is required" });
      }
     

   
  

     let updateUserDetails = await userModel.findOneAndUpdate({_id:userId},
    {$set:{fname:data.fname, lname:data.lname, email:data.email, profileImage:data.profileImage, phone:data.phone, password:data.password, 'address.shipping.street': data.address.shipping.street, 'address.shipping.city': data.address.shipping.city, 'address.shipping.pincode': data.address.shipping.pincode, 'address.billing.street': data.address.billing.street, 'address.billing.city': data.address.billing.city, 'address.billing.pincode': data.address.billing.pincode, }},
    {new:true})
  
    return res.status(200).send({status:true,message:"User details updated successfully", data:updateUserDetails})
  
  
  
      
    } catch (error) {
      res.status(500).send({status:false, error:error.message})
    }
  }

  module.exports.updateUserDetails=updateUserDetails;