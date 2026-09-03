const express = require("express");

const {
    getProcurementRequests,
    getProcurementRequestById,
    createProcurementRequest,
    updateProcurementRequest,
    deleteProcurementRequest,
    getQueueStatus,
    markAsProcured,
    getProcurementStatus
} = require("../controllers/procurementController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getProcurementRequests);

router.get("/queue/:id", protect, getQueueStatus);

router.get("/status/:id", protect, getProcurementStatus);

router.put(
    "/procure/:id",
    protect,
    authorize("Officer", "Admin"),
    markAsProcured
);

router.get("/:id", protect, getProcurementRequestById);

router.post("/", protect, createProcurementRequest);

router.put(
    "/:id",
    protect,
    authorize("Officer", "Admin"),
    updateProcurementRequest
);

router.delete(
    "/:id",
    protect,
    authorize("Officer", "Admin"),
    deleteProcurementRequest
);

module.exports = router;