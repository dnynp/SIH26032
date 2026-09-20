const express = require("express");

const {
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

router.put("/:id/arrive", protect, authorize("Officer", "Admin"), markArrived);
router.put("/:id/quality", protect, authorize("Officer", "Admin"), saveQualityCheck);
router.put("/:id/weigh", protect, authorize("Officer", "Admin"), saveWeight);
router.put("/:id/start", protect, authorize("Officer", "Admin"), startProcessing);

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
