const mongoose = require('mongoose');
const { boolean } = require('webidl-conversions');

// Schema for mongoDB database
const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            min: 3,
            max: 20,
            unique: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
            min: 8,
            max: 16
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
    }, {timestamps: true}
)

// Export the schema as model User
module.exports = mongoose.model("User", userSchema);