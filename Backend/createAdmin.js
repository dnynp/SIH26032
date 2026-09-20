const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const existingAdmin = await User.findOne({
            mobile: "9999999998"
        });

        if (existingAdmin) {
            console.log("Admin already exists");
            process.exit();
        }

        const hashedPassword = await bcrypt.hash("admin123", 10);

        const admin = new User({
            name: "Test Admin",
            mobile: "9999999998",
            password: hashedPassword,
            role: "Admin"
        });

        await admin.save();

        console.log("Admin created successfully");
        console.log("Mobile: 9999999998");
        console.log("Password: admin123");

        process.exit();
    } catch (error) {
        console.log("ADMIN CREATION ERROR:", error.message);
        process.exit(1);
    }
};

createAdmin();