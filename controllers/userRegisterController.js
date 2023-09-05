const userModel = require("../models/userModel.js");
const validator = require('validator');
const bcrypt = require('bcrypt');
let aws = require('../middleware/aws.js');



const createUser = async function (req, res) {
    try {
      let data = req.body;
      
      
     

      let {fname , lname , email , phone , password,address, profileImage}= data

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

      
      if (!phone) {
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
  
      
      let salt = await bcrypt.genSalt(10)
      data.password = await bcrypt.hash(data.password,salt)

      if (address) {

        let addressValidation = data.address
        
      

      if (!addressValidation.shipping.street) {
        return res.status(400).send({ status: false, msg: "Address Shipping street is required" });
      }
      if (!addressValidation.shipping.city) {
        return res.status(400).send({ status: false, msg: "Address Shipping city is required" });
      }
      if (!addressValidation.shipping.pincode) {
        return res.status(400).send({ status: false, msg: "Address Shipping pincode is required" });
      }

      if (!addressValidation.billing.street) {
        return res.status(400).send({ status: false, msg: "Address billing street is required" });
      }
      if (!addressValidation.billing.city) {
        return res.status(400).send({ status: false, msg: "Address billing city is required" });
      }
      if (!addressValidation.billing.pincode) {
        return res.status(400).send({ status: false, msg: "Address billing pincode is required" });
      }
      let files = req.files;
if (files && files.length>0) {
  let uploadedFileURL = await aws.uploadFile(files[0])
  data.profileImage = uploadedFileURL}
  else{
    res.status(400).send({msg:"No file found"})
  }
  


      let createdUser = await userModel.create(data);
      res
        .status(201)
        .send({
          status: true,
          message: "User created successfully",
          data: createdUser,
        });
      }
      
    } catch (error) {
      return res.status(500).send({ msg: error.message });
    }
  }

  module.exports.createUser = createUser;