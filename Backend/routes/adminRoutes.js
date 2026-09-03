const express = require("express");

const {
    getDashboardStats,
    getAllFarmers,
    getAllProcurementRequests,
    getAllPayments
} = require("../controllers/adminController");

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");

const router = express.Router();


router.get(
    "/dashboard",
    protect,
    authorize("Admin"),
    getDashboardStats
);


router.get(
    "/farmers",
    protect,
    authorize("Admin"),
    getAllFarmers
);


router.get(
    "/requests",
    protect,
    authorize("Admin"),
    getAllProcurementRequests
);


router.get(
    "/payments",
    protect,
    authorize("Admin"),
    getAllPayments
);


module.exports = router;