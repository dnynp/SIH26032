const Notification = require("../models/Notification");

// Create notification
const createNotification = async (req, res) => {
    try {
        const notification = new Notification({
            farmer: req.body.farmer,
            title: req.body.title,
            message: req.body.message,
            type: req.body.type
        });

        const savedNotification = await notification.save();

        res.status(201).json({
            message: "Notification created successfully",
            notification: savedNotification
        });

    } catch (error) {
        console.log("CREATE NOTIFICATION ERROR:", error);

        res.status(500).json({
            message: "Failed to create notification",
            error: error.message
        });
    }
};

// Get farmer notifications
const getFarmerNotifications = async (req, res) => {
    try {
        // Farmer can only see their own notifications
        if (req.user.role === "Farmer") {
            if (
                !req.user.farmer ||
                req.params.farmerId !== req.user.farmer.toString()
            ) {
                return res.status(403).json({
                    message: "Access denied. You can only view your own notifications."
                });
            }
        }

        const notifications = await Notification.find({
            farmer: req.params.farmerId
        }).sort({ createdAt: -1 });

        res.json(notifications);

    } catch (error) {
        console.log("GET NOTIFICATIONS ERROR:", error);

        res.status(500).json({
            message: "Failed to fetch notifications",
            error: error.message
        });
    }
};

// Mark notification as read
const markNotificationAsRead = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({
                message: "Notification not found"
            });
        }

        // Farmer can only mark their own notification as read
        if (req.user.role === "Farmer") {
            if (
                !req.user.farmer ||
                notification.farmer.toString() !== req.user.farmer.toString()
            ) {
                return res.status(403).json({
                    message: "Access denied. You can only update your own notifications."
                });
            }
        }

        notification.isRead = true;
        await notification.save();

        res.json({
            message: "Notification marked as read",
            notification
        });

    } catch (error) {
        console.log("MARK NOTIFICATION READ ERROR:", error);

        res.status(500).json({
            message: "Failed to update notification",
            error: error.message
        });
    }
};

module.exports = {
    createNotification,
    getFarmerNotifications,
    markNotificationAsRead
};