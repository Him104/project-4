const userModel = require("../models/userModel.js");      
const jwt = require('jsonwebtoken'); 
const bcrypt = require('bcrypt');

const login = async function (req, res) {
    try {
      const data = req.body;
      if (!data.email) {
        return res
          .status(400)
          .send({ status: false, msg: "Email is required field" });
      }
      if (!data.password) {
        return res
          .status(400)
          .send({ status: false, msg: "Password is required field" });
      }
      const userMatch = await userModel.findOne({
        email: data.email
      });
      if (!userMatch) { 
        
        return res
          .status(400)
          .send({ status: false, msg: "Email or Password is incorrect please enter correct is and pass" });
      }
      const validPassword = await bcrypt.compare(data.password, userMatch.password);
      if (!validPassword) {return res.status(400).send('Invalid Email or Password.')} 

      const token = jwt.sign({ userId: userMatch._id }, process.env.SECRET_KEY, {
        expiresIn: "70h",
      });
      return res
        .status(200)
        .send({ status: true, msg: "User login successfull", data:{
          userId:userMatch._id, token
        }});
    } catch (error) {
      res.status(500).send({ status: false, error: error.msg });
    }
  };
  
  module.exports.login = login;
