const mongoose = require("mongoose");
//const ObjectId = Schema.Types.ObjectId

const cartSchema = new mongoose.Schema({ 

    userId: { type: String, required: true, trim: true },
    items: [
        {
            productId: { type: String, required: true, trim: true },
            quantity: { type: Number, required: true, trim: true, min: 1 }

        }


    ],
    totalPrice: { type: Number, required: true, trim: true },
    totalItems: { type: Number, required: true, trim: true },


}
    , { timestamps: true });

module.exports = mongoose.model('cart', cartSchema);