const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
    res.json({
        message: "Exam Management API is running "
    });
});

const authRoutes = require("./routes/auth.routes");
app.use("/api/auth", authRoutes);

module.exports = app;