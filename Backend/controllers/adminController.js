const Farmer = require("../models/Farmer");
const ProcurementRequest = require("../models/ProcurementRequest");
const Payment = require("../models/Payment");

const getDashboardStats = async (req, res) => {
    try {
        const totalFarmers = await Farmer.countDocuments();

        const totalRequests = await ProcurementRequest.countDocuments();

        const pendingRequests = await ProcurementRequest.countDocuments({
            status: "Pending"
        });

        const approvedRequests = await ProcurementRequest.countDocuments({
            status: "Approved"
        });

        const scheduledRequests = await ProcurementRequest.countDocuments({
            status: "Scheduled"
        });

        const procuredRequests = await ProcurementRequest.countDocuments({
            status: "Procured"
        });

        const rejectedRequests = await ProcurementRequest.countDocuments({
            status: "Rejected"
        });

        const totalPayments = await Payment.countDocuments();

        const completedPayments = await Payment.countDocuments({
            paymentStatus: "Completed"
        });

        const pendingPayments = await Payment.countDocuments({
            paymentStatus: "Pending"
        });

        res.json({
            farmers: {
                total: totalFarmers
            },

            procurementRequests: {
                total: totalRequests,
                pending: pendingRequests,
                approved: approvedRequests,
                scheduled: scheduledRequests,
                procured: procuredRequests,
                rejected: rejectedRequests
            },

            payments: {
                total: totalPayments,
                completed: completedPayments,
                pending: pendingPayments
            }
        });

    } catch (error) {
        console.log("ADMIN DASHBOARD ERROR:", error);

        res.status(500).json({
            message: "Failed to fetch admin dashboard statistics",
            error: error.message
        });
    }
};
const getAllFarmers = async (req, res) => {
    try {
        const farmers = await Farmer.find().sort({ name: 1 });

        res.json({
            count: farmers.length,
            farmers
        });

    } catch (error) {
        console.log("GET ALL FARMERS ERROR:", error);

        res.status(500).json({
            message: "Failed to fetch farmers",
            error: error.message
        });
    }
};


const getAllProcurementRequests = async (req, res) => {
    try {
        const requests = await ProcurementRequest.find()
            .populate("farmer")
            .sort({ createdAt: -1 });

        res.json({
            count: requests.length,
            requests
        });

    } catch (error) {
        console.log("GET ALL PROCUREMENT REQUESTS ERROR:", error);

        res.status(500).json({
            message: "Failed to fetch procurement requests",
            error: error.message
        });
    }
};


const getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find()
            .populate("farmer")
            .populate("procurementRequest")
            .sort({ createdAt: -1 });

        res.json({
            count: payments.length,
            payments
        });

    } catch (error) {
        console.log("GET ALL PAYMENTS ERROR:", error);

        res.status(500).json({
            message: "Failed to fetch payments",
            error: error.message
        });
    }
};


module.exports = {
    getDashboardStats,
    getAllFarmers,
    getAllProcurementRequests,
    getAllPayments
};