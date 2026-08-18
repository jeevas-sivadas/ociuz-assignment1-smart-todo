const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema(
  {
    // =========================
    // Title
    // =========================
    title: {
      type: String,
      required: true,
      trim: true
    },

    // =========================
    // Description
    // =========================
    description: {
      type: String,
      default: ""
    },

    // =========================
    // Due Date
    // =========================
    dueDate: {
      type: Date,
      default: null
    },

    // =========================
    // Priority
    // =========================
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium"
    },

    // =========================
    // Category
    // =========================
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null
    },

    // =========================
    // Complete / Incomplete
    // =========================
    completed: {
      type: Boolean,
      default: false
    },

    // =========================
    // Soft Delete
    // =========================
    deleted: {
      type: Boolean,
      default: false
    },

    // =========================
    // User
    // =========================
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },

  {
    timestamps: true
  }
);

module.exports = mongoose.model("Todo", todoSchema);