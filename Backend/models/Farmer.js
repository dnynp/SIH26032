const mongoose = require("mongoose");

const farmerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    mobile: {
        type: String,
        required: true
    },

    village: {
        type: String,
        required: true
    },

    district: {
        type: String,
        required: true
    },

    state: {
        type: String,
        required: true
    }
});

const Farmer = mongoose.model("Farmer", farmerSchema);

module.exports = Farmer;