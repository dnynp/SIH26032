const mongoose = require("mongoose");

const procurementRequestSchema = new mongoose.Schema({
    farmer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Farmer",
        required: true
    },

    cropName: {
        type: String,
        required: true
    },

    quantity: {
        type: Number,
        required: true
    },

    unit: {
        type: String,
        default: "kg"
    },

    procurementCenter: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: [
            "Pending",
            "Approved",
            "Scheduled",
            "Procured",
            "Rejected"
        ],
        default: "Pending"
    },

    tokenNumber: {
        type: Number,
        unique: true
    },

    scheduledDate: {
        type: Date
    }
});

const ProcurementRequest = mongoose.model(
    "ProcurementRequest",
    procurementRequestSchema
);

module.exports = ProcurementRequest;