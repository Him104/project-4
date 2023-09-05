const userModel = require("../models/userModel.js");
const cartModel = require("../models/cartModel.js");

const updateCart = async function (req, res) {
    try {
        const userId = req.params.userId;
        
        const { cartId, productId, removeProduct } = req.body;

    
        const user = await userModel.findOne({ _id: userId });
        if (!user) {
            return res
            .status(404)
            .send({ status: false, message: "User not found" });
        }

        const userCart = await cartModel.findOne({ _id: cartId, userId: userId });
        if (!userCart) {
            return res
            .status(404)
            .send({ status: false, message: "Cart not found" });
        }

        const updatedCart = await userCart.save();
         return res
        .status(200)
        .send({ status: true, message: "Cart updated successfully", data: updatedCart });
    } catch (error) {
        console.error(error);
        res
        .status(500)
        .send({ status: false, message: "Internal server error" });
    }
};

module.exports.updateCart = updateCart;
