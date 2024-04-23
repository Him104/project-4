const userModel = require("../models/userModel.js");
const validator = require('validator');
const bcrypt = require('bcrypt');
const aws = require('../middleware/aws.js');

const createUser = async function (req, res) {
  try {
    let data = req.body;
    let { fname, lname, email, phone, password, address, profileImage } = data;

    let files = req.files;
    if (files && files.length > 0) {
      let uploadedFileURL = await aws.uploadFile(files[0])
      data.profileImage = uploadedFileURL;
    } else {
      return res.status(400).send({ msg: "No file found" });
    }

    let createdUser = await userModel.create(data);
    res.status(201).send({
      status: true,
      message: "User created successfully",
      data: createdUser,
    });
  } catch (error) {
    return res.status(500).send({ msg: error.message });
  }
}

module.exports = { createUser };
