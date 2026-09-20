const Farmer = require("../models/Farmer");
const User = require("../models/User");

// Returns the profile belonging to the authenticated farmer. It also supports
// accounts created before farmer profiles were linked, so they can complete
// their details without an administrator touching the database.
const getMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).populate("farmer");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json({ user: { id: user._id, name: user.name, mobile: user.mobile, role: user.role }, farmer: user.farmer || null });
    } catch (error) {
        console.log("GET MY PROFILE ERROR:", error);
        res.status(500).json({ message: "Failed to fetch profile" });
    }
};

const updateMyProfile = async (req, res) => {
    try {
        const { name, mobile, village, district, state } = req.body;
        if (![name, mobile, village, district, state].every((value) => typeof value === "string" && value.trim())) {
            return res.status(400).json({ message: "Name, mobile, village, district and state are required." });
        }

        const user = await User.findById(req.user.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const profile = { name: name.trim(), mobile: mobile.trim(), village: village.trim(), district: district.trim(), state: state.trim() };
        let farmer;
        if (user.farmer) {
            farmer = await Farmer.findByIdAndUpdate(user.farmer, profile, { new: true, runValidators: true });
        } else {
            farmer = await Farmer.create(profile);
            user.farmer = farmer._id;
        }
        user.name = profile.name;
        user.mobile = profile.mobile;
        await user.save();
        res.json({ message: "Profile updated successfully", user: { id: user._id, name: user.name, mobile: user.mobile, role: user.role }, farmer });
    } catch (error) {
        console.log("UPDATE MY PROFILE ERROR:", error);
        res.status(error.code === 11000 ? 400 : 500).json({ message: error.code === 11000 ? "This mobile number is already registered." : "Failed to update profile" });
    }
};


// GET all farmers
const getFarmers = async (req, res) => {
    try {
        const farmers = await Farmer.find();

        res.json(farmers);
    } catch (error) {
        console.log("GET FARMERS ERROR:", error);

        res.status(500).json({
            message: "Failed to fetch farmers",
            error: error.message
        });
    }
};


// GET farmer by ID
const getFarmerById = async (req, res) => {
    try {
        const farmer = await Farmer.findById(req.params.id);

        if (!farmer) {
            return res.status(404).json({
                message: "Farmer not found"
            });
        }

        res.json(farmer);
    } catch (error) {
        console.log("GET FARMER BY ID ERROR:", error);

        res.status(500).json({
            message: "Failed to fetch farmer",
            error: error.message
        });
    }
};


// POST new farmer
const createFarmer = async (req, res) => {
    try {
        const farmer = new Farmer({
            name: req.body.name,
            mobile: req.body.mobile,
            village: req.body.village,
            district: req.body.district,
            state: req.body.state
        });

        const savedFarmer = await farmer.save();

        res.status(201).json({
            message: "Farmer added successfully",
            farmer: savedFarmer
        });
    } catch (error) {
        console.log("POST FARMER ERROR:", error);

        res.status(500).json({
            message: "Failed to add farmer",
            error: error.message
        });
    }
};


// PUT update farmer
const updateFarmer = async (req, res) => {
    try {
        const updatedFarmer = await Farmer.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                mobile: req.body.mobile,
                village: req.body.village,
                district: req.body.district,
                state: req.body.state
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedFarmer) {
            return res.status(404).json({
                message: "Farmer not found"
            });
        }

        res.json({
            message: "Farmer updated successfully",
            farmer: updatedFarmer
        });
    } catch (error) {
        console.log("UPDATE FARMER ERROR:", error);

        res.status(500).json({
            message: "Failed to update farmer",
            error: error.message
        });
    }
};


// DELETE farmer
const deleteFarmer = async (req, res) => {
    try {
        const deletedFarmer = await Farmer.findByIdAndDelete(req.params.id);

        if (!deletedFarmer) {
            return res.status(404).json({
                message: "Farmer not found"
            });
        }

        res.json({
            message: "Farmer deleted successfully",
            farmer: deletedFarmer
        });
    } catch (error) {
        console.log("DELETE FARMER ERROR:", error);

        res.status(500).json({
            message: "Failed to delete farmer",
            error: error.message
        });
    }
};


module.exports = {
    getMyProfile,
    updateMyProfile,
    getFarmers,
    getFarmerById,
    createFarmer,
    updateFarmer,
    deleteFarmer
};
