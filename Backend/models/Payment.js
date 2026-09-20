const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    procurementRequest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProcurementRequest",
        required: true,
        unique: true
    },

    farmer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Farmer",
        required: true
    },

    quantity: {
        type: Number,
        required: true
    },

    ratePerUnit: {
        type: Number,
        required: true
    },

    totalAmount: {
        type: Number,
        required: true
    },

    paymentStatus: {
        type: String,
        enum: [
            "Pending",
            "Completed",
            "Failed"
        ],
        default: "Pending"
    },

    paymentDate: {
        type: Date
    }
});

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;