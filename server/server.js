require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const todoRoutes = require("./routes/todoRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

const protect = require("./middleware/authMiddleware");

const app = express();

const PORT = process.env.PORT || 5000;


// =========================
// Middleware
// =========================

app.use(
  cors({
    origin: "http://localhost:5173"
  })
);

app.use(express.json());


// =========================
// Database
// =========================

connectDB();


// =========================
// API Routes
// =========================

// Authentication
app.use("/api/auth", authRoutes);

// Todos
app.use("/api/todos", todoRoutes);

// Categories
app.use("/api/categories", categoryRoutes);


// =========================
// Test Route
// =========================

app.get("/", (req, res) => {
  res.json({
    message: "Smart Todo API is running"
  });
});


// =========================
// Protected Test Route
// =========================

app.get(
  "/api/auth/protected",
  protect,
  (req, res) => {
    res.json({
      message:
        "You have access to the protected route",

      user: req.user
    });
  }
);


// =========================
// 404 Handler
// =========================

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found"
  });
});


// =========================
// Start Server
// =========================

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});