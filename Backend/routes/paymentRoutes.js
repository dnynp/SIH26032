const express = require("express");

const {
    createPayment,
    completePayment,
    getFarmerPayments
} = require("../controllers/paymentController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
    "/my-payments",
    protect,
    authorize("Farmer"),
    getFarmerPayments
);

router.post(
    "/create/:id",
    protect,
    authorize("Officer", "Admin"),
    createPayment
);

router.put(
    "/complete/:id",
    protect,
    authorize("Officer", "Admin"),
    completePayment
);

module.exports = router;