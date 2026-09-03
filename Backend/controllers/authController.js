const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const registerUser = async (req, res) => {
    try {
        const {
            name,
            mobile,
            password,
            farmer
        } = req.body;

        if (!name || !mobile || !password) {
            return res.status(400).json({
                message: "Name, mobile and password are required"
            });
        }

        const existingUser = await User.findOne({ mobile });

        if (existingUser) {
            return res.status(400).json({
                message: "User with this mobile already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User({
    name,
    mobile,
    password: hashedPassword,
    role: "Farmer",
    farmer
});
        const savedUser = await user.save();

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: savedUser._id,
                name: savedUser.name,
                mobile: savedUser.mobile,
                role: savedUser.role,
                farmer: savedUser.farmer
            }
        });

    } catch (error) {
        console.log("REGISTER ERROR:", error);

        res.status(500).json({
            message: "Failed to register user",
            error: error.message
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

        const user = await User.findOne({ mobile });

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

       const token = jwt.sign(
    {
        userId: user._id,
        role: user.role,
        farmer: user.farmer
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "1d"
    }
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

        res.status(500).json({
            message: "Login failed",
            error: error.message
        });
    }
};

module.exports = {
    registerUser,
    loginUser
};