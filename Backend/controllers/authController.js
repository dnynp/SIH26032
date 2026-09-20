const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Farmer = require("../models/Farmer");

const registerUser = async (req, res) => {
    try {
        const {
            name,
            mobile,
            password,
            village,
            district,
            state
        } = req.body;

        if (!name || !mobile || !password || !village || !district || !state) {
            return res.status(400).json({
                message: "Name, mobile, password, village, district and state are required"
            });
        }

        const trimmedMobile = mobile.trim();
        const trimmedName = name.trim();
        const trimmedVillage = village.trim();
        const trimmedDistrict = district.trim();
        const trimmedState = state.trim();

        const existingUser = await User.findOne({ mobile: trimmedMobile });

        if (existingUser) {
            return res.status(400).json({
                message: "User with this mobile already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Find or create farmer record
        let farmer = await Farmer.findOne({ mobile: trimmedMobile });
        if (!farmer) {
            farmer = await Farmer.create({
                name: trimmedName,
                mobile: trimmedMobile,
                village: trimmedVillage,
                district: trimmedDistrict,
                state: trimmedState
            });
        } else {
            farmer.name = trimmedName;
            farmer.village = trimmedVillage;
            farmer.district = trimmedDistrict;
            farmer.state = trimmedState;
            await farmer.save();
        }

        const user = new User({
            name: trimmedName,
            mobile: trimmedMobile,
            password: hashedPassword,
            role: "Farmer",
            farmer: farmer._id
        });
        const savedUser = await user.save();

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: savedUser._id,
                name: savedUser.name,
                mobile: savedUser.mobile,
                role: savedUser.role,
                farmer
            }
        });

    } catch (error) {
        console.log("REGISTER ERROR:", error);

        if (error.code === 11000) {
            return res.status(400).json({
                message: "User with this mobile already exists"
            });
        }

        const databaseUnavailable = error.name === "MongooseError" ||
            error.message?.includes("buffering timed out") ||
            error.name === "MongoServerSelectionError";
        res.status(databaseUnavailable ? 503 : 500).json({
            message: databaseUnavailable
                ? "Registration service is temporarily unavailable. Please try again shortly."
                : (error.message || "Failed to register user"),
            errorCode: error.name || "RegistrationError"
        });
    }
};

// Login user
const loginUser = async (req, res) => {
    try {
        const { mobile, password } = req.body;

        if (!mobile || !password) {
            return res.status(400).json({
                message: "Mobile and password are required"
            });
        }

        const trimmedMobile = mobile.trim();
        let user = await User.findOne({ mobile: trimmedMobile }).populate("farmer");

        if (!user) {
            return res.status(401).json({
                message: "Invalid mobile or password"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid mobile or password"
            });
        }

        // Auto-link or create farmer profile if role is Farmer and profile is missing
        if (user.role === "Farmer" && !user.farmer) {
            let farmer = await Farmer.findOne({ mobile: user.mobile });
            if (!farmer) {
                farmer = await Farmer.create({
                    name: user.name,
                    mobile: user.mobile,
                    village: "Nashik Village",
                    district: "Nashik",
                    state: "Maharashtra"
                });
            }
            user.farmer = farmer._id;
            await user.save();
            user = await User.findById(user._id).populate("farmer");
        }

        const token = jwt.sign(
            {
                userId: user._id,
                role: user.role,
                farmer: user.farmer?._id || user.farmer
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            message: "Login successful",
            token: token,
            user: {
                id: user._id,
                name: user.name,
                mobile: user.mobile,
                role: user.role,
                farmer: user.farmer
            }
        });

    } catch (error) {
        console.log("LOGIN ERROR:", error);

        const databaseUnavailable = error.name === "MongooseError" ||
            error.message?.includes("buffering timed out") ||
            error.name === "MongoServerSelectionError";
        res.status(databaseUnavailable ? 503 : 500).json({
            message: databaseUnavailable
                ? "Login service is temporarily unavailable. Please try again shortly."
                : "Login failed",
            errorCode: error.name || "LoginError"
        });
    }
};

// Get current authenticated user profile
const getCurrentUser = async (req, res) => {
    try {
        let user = await User.findById(req.user.userId).populate("farmer");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role === "Farmer" && !user.farmer) {
            let farmer = await Farmer.findOne({ mobile: user.mobile });
            if (!farmer) {
                farmer = await Farmer.create({
                    name: user.name,
                    mobile: user.mobile,
                    village: "Nashik Village",
                    district: "Nashik",
                    state: "Maharashtra"
                });
            }
            user.farmer = farmer._id;
            await user.save();
            user = await User.findById(user._id).populate("farmer");
        }

        res.json({
            user: {
                id: user._id,
                name: user.name,
                mobile: user.mobile,
                role: user.role,
                farmer: user.farmer
            }
        });
    } catch (error) {
        console.log("GET CURRENT USER ERROR:", error);
        res.status(500).json({ message: "Failed to fetch profile", error: error.message });
    }
};

// Update profile details
const updateProfile = async (req, res) => {
    try {
        const { name, village, district, state } = req.body;
        let user = await User.findById(req.user.userId).populate("farmer");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (name && name.trim()) {
            user.name = name.trim();
            await user.save();
        }

        let farmer = user.farmer;
        if (!farmer) {
            farmer = await Farmer.findOne({ mobile: user.mobile });
        }

        if (!farmer) {
            farmer = await Farmer.create({
                name: user.name,
                mobile: user.mobile,
                village: village ? village.trim() : "Nashik Village",
                district: district ? district.trim() : "Nashik",
                state: state ? state.trim() : "Maharashtra"
            });
            user.farmer = farmer._id;
            await user.save();
        } else {
            if (name && name.trim()) farmer.name = name.trim();
            if (village !== undefined) farmer.village = village.trim();
            if (district !== undefined) farmer.district = district.trim();
            if (state !== undefined) farmer.state = state.trim();
            await farmer.save();
        }

        res.json({
            message: "Profile updated successfully",
            user: {
                id: user._id,
                name: user.name,
                mobile: user.mobile,
                role: user.role,
                farmer
            }
        });
    } catch (error) {
        console.log("UPDATE PROFILE ERROR:", error);
        res.status(500).json({ message: "Failed to update profile", error: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getCurrentUser,
    updateProfile
};
