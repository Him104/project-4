const userModel = require("../models/userModel.js");
const jwt = require('jsonwebtoken'); 
const config = require('../config/config');

const authentication = async function(req, res, next) {
    try {
        const token = req.headers['x-api-key'];

        if (!token) {
            return res.status(400).send({ status: false, msg: "Login is required, Token set in header" });
        }

        const decodedToken = jwt.verify(token, config.jwtSecret);
        
        if (!decodedToken) {
            return res.status(400).send({ status: false, msg: "Token is invalid" });
        }

        // Attach the decoded token to the request object for further use if needed
        req.user = decodedToken;

        next();
    } catch (error) {
        res.status(500).send({ msg: error.message });
    }
};

const authorization = async function(req, res, next) {
    try {
        const token = req.headers['x-api-key'];
        const decodedToken = jwt.verify(token, config.jwtSecret);

        const userId = req.params.userId;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).send({ status: false, msg: "Enter a valid UserId" });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(401).send({ status: false, msg: "User not found" });
        }

        if (decodedToken.userId !== user._id.toString()) {
            return res.status(401).send({ status: false, msg: "You are not authorized" });
        }

        next();
    } catch (error) {
        res.status(500).send({ msg: error.message });
    }
};

module.exports.authentication = authentication;
module.exports.authorization = authorization;
