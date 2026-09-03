const Payment = require("../models/Payment");
const ProcurementRequest = require("../models/ProcurementRequest");
const Notification = require("../models/Notification");


// Create payment
const createPayment = async (req, res) => {
    try {
        const request = await ProcurementRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({
                message: "Procurement request not found"
            });
        }

        // Payment is allowed only after procurement is completed
        if (request.status !== "Procured") {
            return res.status(400).json({
                message: `Payment cannot be created. Procurement status is ${request.status}.`
            });
        }

        // Check for existing payment
        const existingPayment = await Payment.findOne({
            procurementRequest: request._id
        });

        if (existingPayment) {
            return res.status(400).json({
                message: "Payment already exists for this procurement request."
            });
        }

        const ratePerUnit = Number(req.body.ratePerUnit);

        // Validate rate
        if (!Number.isFinite(ratePerUnit) || ratePerUnit <= 0) {
            return res.status(400).json({
                message: "Rate per unit must be greater than 0."
            });
        }

        const totalAmount = request.quantity * ratePerUnit;

        const payment = new Payment({
            procurementRequest: request._id,
            farmer: request.farmer,
            quantity: request.quantity,
            ratePerUnit: ratePerUnit,
            totalAmount: totalAmount,
            paymentStatus: "Pending"
        });

        const savedPayment = await payment.save();

        res.status(201).json({
            message: "Payment created successfully",
            payment: savedPayment
        });

    } catch (error) {
        console.log("CREATE PAYMENT ERROR:", error);

        res.status(500).json({
            message: "Failed to create payment",
            error: error.message
        });
    }
};

// Mark payment as completed
const completePayment = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id);

        if (!payment) {
            return res.status(404).json({
                message: "Payment not found"
            });
        }

        if (payment.paymentStatus === "Completed") {
            return res.status(400).json({
                message: "Payment is already completed"
            });
        }

        payment.paymentStatus = "Completed";
        payment.paymentDate = new Date();

        const updatedPayment = await payment.save();

        const request = await ProcurementRequest.findById(
            payment.procurementRequest
        );

        await Notification.create({
            farmer: payment.farmer,
            title: "Payment Completed",
            message: `Your payment of ₹${payment.totalAmount} for ${payment.quantity} kg ${request.cropName} has been completed.`,
            type: "Payment"
        });

        res.json({
            message: "Payment completed successfully",
            payment: updatedPayment
        });

    } catch (error) {
        console.log("COMPLETE PAYMENT ERROR:", error);

        res.status(500).json({
            message: "Failed to complete payment",
            error: error.message
        });
    }
};

// Get farmer payments
const getFarmerPayments = async (req, res) => {
    try {
        const payments = await Payment.find({
            farmer: req.user.farmer
        }).populate("procurementRequest");

        res.json(payments);

    } catch (error) {
        console.log("GET FARMER PAYMENTS ERROR:", error);

        res.status(500).json({
            message: "Failed to fetch payments",
            error: error.message
        });
    }
};

module.exports = {
    createPayment,
    completePayment,
    getFarmerPayments
};