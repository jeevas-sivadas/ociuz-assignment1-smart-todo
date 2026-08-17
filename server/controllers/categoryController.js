const Category = require("../models/Category");
const Todo = require("../models/Todo");


// =========================
// Create Category
// =========================

const createCategory = async (req, res) => {
  try {
    const { name, color } = req.body;

    // Validate name
    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Category name is required"
      });
    }

    const categoryName = name.trim();

    // Check duplicate category
    const existingCategory = await Category.findOne({
      name: categoryName,
      user: req.user._id
    });

    if (existingCategory) {
      return res.status(409).json({
        message: "Category already exists"
      });
    }

    // Create category
    const category = await Category.create({
      name: categoryName,
      color: color || "#6366f1",
      user: req.user._id
    });

    res.status(201).json({
      message: "Category created successfully",
      category
    });

  } catch (error) {
    console.error(error);

    // Duplicate index protection
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Category already exists"
      });
    }

    res.status(500).json({
      message: "Failed to create category"
    });
  }
};


// =========================
// Get All Categories
// =========================

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({
      user: req.user._id
    }).sort({
      createdAt: -1
    });

    res.json(categories);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch categories"
    });
  }
};


// =========================
// Get Single Category
// =========================

const getCategory = async (req, res) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!category) {
      return res.status(404).json({
        message: "Category not found"
      });
    }

    res.json(category);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch category"
    });
  }
};


// =========================
// Update Category
// =========================

const updateCategory = async (req, res) => {
  try {
    const { name, color } = req.body;

    const category = await Category.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!category) {
      return res.status(404).json({
        message: "Category not found"
      });
    }


    // Update name
    if (name !== undefined) {

      if (!name.trim()) {
        return res.status(400).json({
          message: "Category name cannot be empty"
        });
      }

      const categoryName = name.trim();

      // Check duplicate
      const existingCategory = await Category.findOne({
        name: categoryName,
        user: req.user._id,
        _id: { $ne: category._id }
      });

      if (existingCategory) {
        return res.status(409).json({
          message: "Category already exists"
        });
      }

      category.name = categoryName;
    }


    // Update color
    if (color !== undefined) {
      category.color = color;
    }


    await category.save();

    res.json({
      message: "Category updated successfully",
      category
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update category"
    });
  }
};


// =========================
// Delete Category
// =========================

const deleteCategory = async (req, res) => {
  try {

    const category = await Category.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!category) {
      return res.status(404).json({
        message: "Category not found"
      });
    }


    // Remove category from Todos
    await Todo.updateMany(
      {
        category: category._id,
        user: req.user._id
      },
      {
        $set: {
          category: null
        }
      }
    );


    // Delete category
    await Category.deleteOne({
      _id: category._id
    });


    res.json({
      message: "Category deleted successfully"
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete category"
    });
  }
};


// =========================
// Export
// =========================

module.exports = {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory
};