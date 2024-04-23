const userModel = require("../models/userModel.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const config = require("../config/config");
const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length == 0) return false;
  return true;
};

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------

const login = async function (req, res) {
  try {
    const data = req.body;
    if (Object.keys(data) == 0)
      return res
        .status(400)
        .send({ status: false, msg: "Bad Request, No data provided" });

    if (!isValid(data.email) || !isValid(data.password)) {
      return res
        .status(400)
        .send({ status: false, msg: "Email and password are required fields" });
    }

    const userMatch = await userModel.findOne({
      email: data.email,
      password: data.password,
    });

    if (!userMatch) {
      return res
        .status(400)
        .send({
          status: false,
          msg: "Invalid email or password. Please enter correct email and password.",
        });
    }

    const token = jwt.sign({ userId: userMatch._id }, config.jwtSecret, {
      expiresIn: "70h",
    });

    return res
      .status(200)
      .send({
        status: true,
        msg: "User login successful",
        data: { userId: userMatch._id, token },
      });
  } catch (error) {
    console.error("Login error:", error);
    res
      .status(500)
      .send({ status: false, error: "An internal server error occurred" });
  }
};

module.exports.login = login;
