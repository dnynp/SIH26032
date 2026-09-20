const express = require("express");

const {
    getFarmers,
    getFarmerById,
    createFarmer,
    updateFarmer,
    deleteFarmer,
    getMyProfile,
    updateMyProfile
} = require("../controllers/farmerController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/me", protect, getMyProfile);
router.put("/me", protect, updateMyProfile);
router.get("/", protect, getFarmers);
router.get("/:id", protect, getFarmerById);
router.post("/", protect, createFarmer);
router.put("/:id", protect, updateFarmer);
router.delete("/:id", protect, deleteFarmer);

module.exports = router;
