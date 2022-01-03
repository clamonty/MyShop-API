const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
    {
        // Each cart must have an associated userId
        userId: {
            type: String,
            required: true,
            unique: true
        },
        // Each cart will have an array of products
        products: [
            {
                productId: {
                    type: String
                },
                quantity: {
                    type: Number,
                    default: 1,
                }
            }
        ]
    }
)

module.exports = mongoose.model("Cart", cartSchema);