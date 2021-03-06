const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true
        },
        description: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        category: {
            type: Array,
            required: true,

        },
        size: {
            type: String,
        },
        color: {
            type: String,
        },
        price: {
            type: Number,
        }
    }
)

module.exports = mongoose.model("Product", productSchema);