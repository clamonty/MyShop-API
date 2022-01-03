const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
        // ID of user who made order
        userId: {
            type: String,
            required: true,
            unique: true,
        },
        // Items purchased in order
        products: [
            {
                productId: {
                    type: String
                },
                quantity: {
                    type: Number,
                    default: 1
                }
            }
        ],
        // Cost of order
        amount: {
            type: Number,
            required: true
        },
        // Object because Stripe api will return us an object after purchase
        address: {
            type: Object,
            required: true
        },
        // Will change from pending -> shipped -> delivered
        status: {
            type: String,
            default: "pending"
        }
    }
)

module.exports = mongoose.model("Order", orderSchema);