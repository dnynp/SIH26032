const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    mobile: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ["Farmer", "Officer", "Admin"],
        default: "Farmer"
    },

    farmer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Farmer"
    }
}, {
    timestamps: true
});

const User = mongoose.model("User", userSchema);

module.exports = User;