const ProcurementRequest = require("../models/ProcurementRequest");
const Counter = require("../models/Counter");
const Notification = require("../models/Notification");
const Payment = require("../models/Payment");

const createOperationalNotification = (farmer, title, message, type) =>
    Notification.create({ farmer, title, message, type });

// GET all procurement requests
const getProcurementRequests = async (req, res) => {
    try {
        let requests;

        if (req.user.role === "Farmer") {
            requests = await ProcurementRequest.find({
                farmer: req.user.farmer
            }).populate("farmer");
        } else {
            requests = await ProcurementRequest.find()
                .populate("farmer");
        }

        res.json(requests);

    } catch (error) {
        console.log("GET PROCUREMENT REQUESTS ERROR:", error);

        res.status(500).json({
            message: "Failed to fetch procurement requests",
            error: error.message
        });
    }
};


// GET procurement request by ID
const getProcurementRequestById = async (req, res) => {
    try {
        const request = await ProcurementRequest.findById(req.params.id)
            .populate("farmer");

        if (!request) {
            return res.status(404).json({
                message: "Procurement request not found"
            });
        }

        if (
            req.user.role === "Farmer" &&
            request.farmer._id.toString() !== req.user.farmer.toString()
        ) {
            return res.status(403).json({
                message: "Access denied"
            });
        }

        res.json(request);

    } catch (error) {
        console.log("GET PROCUREMENT REQUEST ERROR:", error);

        res.status(500).json({
            message: "Failed to fetch procurement request",
            error: error.message
        });
    }
};


// POST new procurement request
const createProcurementRequest = async (req, res) => {
    try {
        const {
            cropName,
            quantity,
            unit,
            procurementCenter
        } = req.body;

        // Required fields
        const farmer = req.user.role === "Farmer" ? req.user.farmer : req.body.farmer;
        if (!farmer || !cropName || quantity === undefined || !procurementCenter) {
            return res.status(400).json({
                message: "Farmer, crop name, quantity and procurement center are required."
            });
        }

        // Crop validation
        if (typeof cropName !== "string" || cropName.trim() === "") {
            return res.status(400).json({
                message: "Crop name cannot be empty."
            });
        }

        // Quantity validation
        const numericQuantity = Number(quantity);

        if (!Number.isFinite(numericQuantity) || numericQuantity <= 0) {
            return res.status(400).json({
                message: "Quantity must be greater than 0."
            });
        }

        // Generate token
        const counter = await Counter.findOneAndUpdate(
            { name: "procurementToken" },
            { $inc: { value: 1 } },
            { new: true, upsert: true }
        );

        const procurementRequest = new ProcurementRequest({
            farmer,
            cropName: cropName.trim(),
            quantity: numericQuantity,
            unit: unit || "kg",
            procurementCenter: procurementCenter.trim(),
            tokenNumber: counter.value
        });

        const savedRequest = await procurementRequest.save();

        // Create notification
        await Notification.create({
            farmer: farmer,
            title: "Procurement Request Submitted",
            message: `Your ${cropName.trim()} procurement request has been submitted successfully. Token number: ${counter.value}.`,
            type: "Request"
        });

        res.status(201).json({
            message: "Procurement request created successfully",
            request: savedRequest
        });

    } catch (error) {
        console.log("CREATE PROCUREMENT REQUEST ERROR:", error);

        res.status(500).json({
            message: "Failed to create procurement request",
            error: error.message
        });
    }
};


// PUT update procurement request
const updateProcurementRequest = async (req, res) => {
    try {
        const request = await ProcurementRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({
                message: "Procurement request not found"
            });
        }

        const newStatus = req.body.status;

        const validStatuses = [
            "Pending",
            "Approved",
            "Scheduled",
            "Procured",
            "Rejected"
        ];

        if (newStatus && !validStatuses.includes(newStatus)) {
            return res.status(400).json({
                message: "Invalid procurement status."
            });
        }

        // Check valid status transition
        if (newStatus && newStatus !== request.status) {

            const allowedTransitions = {
                Pending: ["Approved", "Rejected"],
                Approved: ["Scheduled"],
                Scheduled: ["Procured"],
                Procured: [],
                Rejected: []
            };

            if (!allowedTransitions[request.status].includes(newStatus)) {
                return res.status(400).json({
                    message: `Invalid status change from ${request.status} to ${newStatus}.`
                });
            }
        }

        request.cropName = req.body.cropName ?? request.cropName;
        request.quantity = req.body.quantity ?? request.quantity;
        request.unit = req.body.unit ?? request.unit;
        request.procurementCenter =
            req.body.procurementCenter ?? request.procurementCenter;

        if (newStatus) {
            request.status = newStatus;
        }

        if (req.body.scheduledDate) {
    const scheduledDate = new Date(req.body.scheduledDate);

    if (isNaN(scheduledDate.getTime())) {
        return res.status(400).json({
            message: "Invalid scheduled date."
        });
    }

    if (scheduledDate <= new Date()) {
        return res.status(400).json({
            message: "Scheduled date must be in the future."
        });
    }

    request.scheduledDate = scheduledDate;
}

        const updatedRequest = await request.save();

        res.json({
            message: "Procurement request updated successfully",
            request: updatedRequest
        });

    } catch (error) {
        console.log("UPDATE PROCUREMENT ERROR:", error);

        res.status(500).json({
            message: "Failed to update procurement request",
            error: error.message
        });
    }
};

// DELETE procurement request
const deleteProcurementRequest = async (req, res) => {
    try {
        const deletedRequest =
            await ProcurementRequest.findByIdAndDelete(req.params.id);

        if (!deletedRequest) {
            return res.status(404).json({
                message: "Procurement request not found"
            });
        }

        res.json({
            message: "Procurement request deleted successfully",
            request: deletedRequest
        });
    } catch (error) {
        console.log("DELETE PROCUREMENT REQUEST ERROR:", error);

        res.status(500).json({
            message: "Failed to delete procurement request",
            error: error.message
        });
    }
};


// Mark procurement request as procured
const markAsProcured = async (req, res) => {
    try {
        const request = await ProcurementRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({
                message: "Procurement request not found"
            });
        }

        if (request.status !== "Scheduled" || !request.processingStartedAt) {
            return res.status(400).json({ message: "Complete arrival, approved quality check, weighing and processing before procurement." });
        }

        request.status = "Procured";
        request.procuredAt = new Date();

        const updatedRequest = await request.save();

        await Notification.create({
            farmer: updatedRequest.farmer,
            title: "Procurement Completed",
            message: `Your ${updatedRequest.cropName} procurement has been successfully completed.`,
            type: "Procurement"
        });

        await updatedRequest.populate("farmer");

        res.json({
            message: "Procurement completed successfully",
            request: updatedRequest
        });

    } catch (error) {
        console.log("MARK AS PROCURED ERROR:", error);

        res.status(500).json({
            message: "Failed to mark procurement as procured",
            error: error.message
        });
    }
};

const markArrived = async (req, res) => {
    try {
        const request = await ProcurementRequest.findById(req.params.id);
        if (!request) return res.status(404).json({ message: "Procurement request not found" });
        if (request.status !== "Scheduled") return res.status(400).json({ message: "Only scheduled farmers can be marked as arrived." });
        if (request.arrivalStatus === "Arrived") return res.status(400).json({ message: "Farmer is already marked as arrived." });
        request.arrivalStatus = "Arrived";
        request.arrivedAt = new Date();
        await request.save();
        await createOperationalNotification(request.farmer, "Arrival Confirmed", "Your arrival at the procurement centre has been recorded.", "Schedule");
        res.json({ message: "Farmer arrival recorded", request });
    } catch (error) { console.log("ARRIVAL ERROR:", error); res.status(500).json({ message: "Failed to record arrival" }); }
};

const saveQualityCheck = async (req, res) => {
    try {
        const request = await ProcurementRequest.findById(req.params.id);
        const { qualityStatus, moisture, grade, remarks } = req.body;
        if (!request) return res.status(404).json({ message: "Procurement request not found" });
        if (request.arrivalStatus !== "Arrived") return res.status(400).json({ message: "Record farmer arrival before the quality check." });
        const moistureValue = Number(moisture);
        if (!["Approved", "Rejected"].includes(qualityStatus) || !Number.isFinite(moistureValue) || moistureValue < 0 || moistureValue > 100 || !["A", "B", "C"].includes(grade)) return res.status(400).json({ message: "Provide valid quality status, moisture (0–100) and grade." });
        Object.assign(request, { qualityStatus, moisture: moistureValue, grade, qualityRemarks: String(remarks || "").trim(), checkedBy: req.user.userId, checkedAt: new Date() });
        await request.save();
        await createOperationalNotification(request.farmer, "Quality Check Completed", `Quality check result: ${qualityStatus}.`, "Procurement");
        res.json({ message: "Quality check saved", request });
    } catch (error) { console.log("QUALITY ERROR:", error); res.status(500).json({ message: "Failed to save quality check" }); }
};

const saveWeight = async (req, res) => {
    try {
        const request = await ProcurementRequest.findById(req.params.id);
        const actualWeight = Number(req.body.actualWeight);
        if (!request) return res.status(404).json({ message: "Procurement request not found" });
        if (request.qualityStatus !== "Approved") return res.status(400).json({ message: "Approved quality check is required before weighing." });
        if (!Number.isFinite(actualWeight) || actualWeight <= 0) return res.status(400).json({ message: "Actual weight must be greater than zero." });
        Object.assign(request, { expectedQuantity: request.quantity, actualWeight, weighedBy: req.user.userId, weighedAt: new Date() });
        await request.save();
        res.json({ message: "Weight recorded", request });
    } catch (error) { console.log("WEIGH ERROR:", error); res.status(500).json({ message: "Failed to record weight" }); }
};

const startProcessing = async (req, res) => {
    try {
        const request = await ProcurementRequest.findById(req.params.id);
        if (!request) return res.status(404).json({ message: "Procurement request not found" });
        if (!request.weighedAt) return res.status(400).json({ message: "Record actual weight before starting procurement." });
        request.processingStartedAt = request.processingStartedAt || new Date();
        await request.save();
        res.json({ message: "Procurement processing started", request });
    } catch (error) { console.log("PROCESSING ERROR:", error); res.status(500).json({ message: "Failed to start processing" }); }
};

const getQueueStatus = async (req, res) => {
    try {
        const request = await ProcurementRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({
                message: "Procurement request not found"
            });
        }

        // Farmer can only see their own queue
        if (req.user.role === "Farmer") {
            if (
                !req.user.farmer ||
                request.farmer.toString() !== req.user.farmer.toString()
            ) {
                return res.status(403).json({
                    message: "Access denied. You can only view your own queue status."
                });
            }
        }

        const peopleAhead = await ProcurementRequest.countDocuments({
            procurementCenter: request.procurementCenter,
            tokenNumber: { $lt: request.tokenNumber },
            status: {
                $in: ["Pending", "Approved", "Scheduled"]
            }
        });

        const estimatedWaitMinutes = peopleAhead * 10;

        const estimatedDate = new Date();
        estimatedDate.setMinutes(
            estimatedDate.getMinutes() + estimatedWaitMinutes
        );

        res.json({
            tokenNumber: request.tokenNumber,
            peopleAhead: peopleAhead,
            estimatedWaitMinutes: estimatedWaitMinutes,
            estimatedDate: estimatedDate.toISOString().split("T")[0],
            estimatedTime: estimatedDate.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit"
            }),
            procurementCenter: request.procurementCenter,
            status: request.status
        });

    } catch (error) {
        console.log("GET QUEUE STATUS ERROR:", error);

        res.status(500).json({
            message: "Failed to fetch queue status",
            error: error.message
        });
    }
};

const getProcurementStatus = async (req, res) => {
    try {
        const request = await ProcurementRequest.findById(req.params.id)
            .populate("farmer");

        if (!request) {
            return res.status(404).json({
                message: "Procurement request not found"
            });
        }

        // Farmer can only see their own procurement status
        if (req.user.role === "Farmer") {
            if (
                !req.user.farmer ||
                request.farmer._id.toString() !== req.user.farmer.toString()
            ) {
                return res.status(403).json({
                    message: "Access denied. You can only view your own procurement status."
                });
            }
        }

        const payment = await Payment.findOne({
            procurementRequest: request._id
        });

        res.json({
            request,
            payment: payment || null
        });

    } catch (error) {
        console.log("GET PROCUREMENT STATUS ERROR:", error);

        res.status(500).json({
            message: "Failed to fetch procurement status",
            error: error.message
        });
    }
};

module.exports = {
    getProcurementRequests,
    getProcurementRequestById,
    createProcurementRequest,
    updateProcurementRequest,
    deleteProcurementRequest,
    getQueueStatus,
    markAsProcured,
    getProcurementStatus,
    markArrived,
    saveQualityCheck,
    saveWeight,
    startProcessing
};
