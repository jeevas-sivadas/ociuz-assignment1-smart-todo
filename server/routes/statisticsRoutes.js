const express = require("express");

const {
  getStatistics
} = require("../controllers/statisticsController");

const protect =
  require("../middleware/authMiddleware");

const router =
  express.Router();


// =========================
// Authentication
// =========================

router.use(protect);


// =========================
// Statistics
// =========================

router.get(
  "/",
  getStatistics
);


module.exports = router;