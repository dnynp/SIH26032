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
    },
    arrivalStatus: { type: String, enum: ["Not Arrived", "Arrived"], default: "Not Arrived" },
    arrivedAt: Date,
    qualityStatus: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
    moisture: Number,
    grade: { type: String, enum: ["A", "B", "C"] },
    qualityRemarks: String,
    checkedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    checkedAt: Date,
    expectedQuantity: Number,
    actualWeight: Number,
    weighedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    weighedAt: Date,
    processingStartedAt: Date,
    procuredAt: Date
});

const ProcurementRequest = mongoose.model(
    "ProcurementRequest",
    procurementRequestSchema
);

module.exports = ProcurementRequest;
