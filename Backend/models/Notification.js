const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    farmer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Farmer",
        required: true
    },

    title: {
        type: String,
        required: true
    },

    message: {
        type: String,
        required: true
    },

    type: {
        type: String,
        enum: [
            "Request",
            "Approval",
            "Schedule",
            "Procurement",
            "Payment"
        ],
        required: true
    },

    isRead: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const Notification = mongoose.model(
    "Notification",
    notificationSchema
);

module.exports = Notification;