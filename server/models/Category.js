const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    // =========================
    // Category Name
    // =========================
    name: {
      type: String,
      required: true,
      trim: true
    },

    // =========================
    // Category Color
    // =========================
    color: {
      type: String,
      default: "#6366f1"
    },

    // =========================
    // Category Owner
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


// Prevent duplicate category names
// for the same user
categorySchema.index(
  {
    name: 1,
    user: 1
  },
  {
    unique: true
  }
);


module.exports = mongoose.model(
  "Category",
  categorySchema
);