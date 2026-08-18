const express = require("express");

const {
  createTodo,
  getTodos,
  getTodo,
  updateTodo,
  deleteTodo,
  toggleTodo
} = require("../controllers/todoController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


// =========================
// Authentication
// =========================

router.use(protect);


// =========================
// Todo Routes
// =========================

// Create Todo
router.post("/", createTodo);

// Get all Todos
router.get("/", getTodos);

// Get single Todo
router.get("/:id", getTodo);

// Update Todo
router.put("/:id", updateTodo);

// Toggle complete/incomplete
router.patch("/:id/toggle", toggleTodo);

// Soft delete Todo
router.delete("/:id", deleteTodo);


module.exports = router;