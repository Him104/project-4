const userModel = require("../models/userModel.js");
const validator = require('validator');
const bcrypt = require('bcrypt');


const createUser = async function (req, res) {
    try {
      let data = req.body;
      let files = req.files;
      //let profileImage = req.file;
      //data.profileImage = profileImage;

      let {fname , lname , email , phone , password,address }= data

      if (!fname) {
        return res
          .status(400)
          .send({ status: false, msg: "fname is a required field" });
      }
      if (!lname) {
        return res.status(400).send({ status: false, msg: "lname name is required" });
      }

      if (!email) {
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
      if (phone.length < 10 || phone.length > 10) {
        return res.status(400).send({ status: false, msg: "phone no must be 10 digit" });
      }

      const duplicatePhone = await userModel.findOne({ phone: data.phone });
  
      if (duplicatePhone) {
        return res
          .status(400)
          .send({ status: false, msg: "Phone already exists" });
      }
      
      if (!password) {
        return res
          .status(400)
          .send({ status: false, msg: "password is required" });
      }
  
      if (!(password.length > 8 && password.length < 15)) {
        return res
          .status(400)
          .send({
            status: false,
            msg: "password length should be between 8 to 15 characters"});
      }

      let salt = await bcrypt.genSalt(10)
      data.password = await bcrypt.hash(data.password,salt)

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
  
      let createdUser = await userModel.create(data);
      res
        .status(201)
        .send({
          status: true,
          message: "User created successfully",
          data: createdUser,
        });
    } catch (error) {
      return res.status(500).send({ msg: error.message });
    }
  }

  module.exports.createUser = createUser;