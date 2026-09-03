const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const farmerRoutes = require("./routes/farmerRoutes");
const procurementRoutes = require("./routes/procurementRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(cors({
    origin: "http://localhost:5173"
}));

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((error) => {
        console.log("MongoDB connection failed:", error.message);
    });

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/farmers", farmerRoutes);
app.use("/api/procurement", procurementRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);

app.listen(5000, () => {
    console.log("Server running on port 5000");
});