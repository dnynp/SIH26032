const express = require("express");

const {
    getFarmers,
    getFarmerById,
    createFarmer,
    updateFarmer,
    deleteFarmer
} = require("../controllers/farmerController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getFarmers);
router.get("/:id", protect, getFarmerById);
router.post("/", protect, createFarmer);
router.put("/:id", protect, updateFarmer);
router.delete("/:id", protect, deleteFarmer);

module.exports = router;