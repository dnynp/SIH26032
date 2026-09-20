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

// Development-safe request trace. It confirms that the browser is reaching
// this server instance without ever logging passwords or request bodies.
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/farmers", farmerRoutes);
app.use("/api/procurement", procurementRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);

// Do not accept API requests until MongoDB is available. Previously the
// server started first and login/register could return a vague 500 while
// Mongoose was still waiting for Atlas.
async function startServer() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 10000
        });
        console.log("MongoDB connected");

        app.listen(5000, () => {
            console.log("Server running on port 5000");
        });
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
}

startServer();
