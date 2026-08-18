const express = require("express");

const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory
} = require("../controllers/categoryController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


// =========================
// Authentication
// =========================

router.use(protect);


// =========================
// Category Routes
// =========================

// Create category
router.post("/", createCategory);

// Get all categories
router.get("/", getCategories);

// Get single category
router.get("/:id", getCategory);

// Update category
router.put("/:id", updateCategory);

// Delete category
router.delete("/:id", deleteCategory);


module.exports = router;