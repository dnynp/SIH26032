const Farmer = require("../models/Farmer");


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
    getFarmers,
    getFarmerById,
    createFarmer,
    updateFarmer,
    deleteFarmer
};