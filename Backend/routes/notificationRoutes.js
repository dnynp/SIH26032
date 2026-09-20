const express = require("express");

const {
    createNotification,
    getFarmerNotifications,
    markNotificationAsRead
} = require("../controllers/notificationController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Create notification - Officer/Admin only
router.post(
    "/",
    protect,
    authorize("Officer", "Admin"),
    createNotification
);

// Mark notification as read - logged-in user
router.put(
    "/read/:id",
    protect,
    markNotificationAsRead
);

// Get farmer notifications
router.get(
    "/:farmerId",
    protect,
    getFarmerNotifications
);

module.exports = router;