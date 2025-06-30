const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const startWeeklyResetJob = require("./cron/resetWeekly");

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const dailyEntryRoutes = require("./routes/dailyEntryRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/entries", dailyEntryRoutes);
app.use("/api/analytics", analyticsRoutes);

// CRON 
startWeeklyResetJob();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected!"))
    .catch(err => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${process.env.PORT}`);
});