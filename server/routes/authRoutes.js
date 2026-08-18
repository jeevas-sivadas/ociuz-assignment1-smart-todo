const express = require("express");

const {
  register,
  login,
  getProtectedUser
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


// =========================
// Register
// =========================

router.post(
  "/register",
  register
);


// =========================
// Login
// =========================

router.post(
  "/login",
  login
);


// =========================
// Protected User
// =========================

router.get(
  "/protected",
  protect,
  getProtectedUser
);


module.exports = router;