const Todo = require("../models/Todo");


// Allowed priority levels
const ALLOWED_PRIORITIES = [
  "high",
  "medium",
  "low"
];


// =========================
// Create Todo
// =========================

const createTodo = async (req, res) => {
  try {
    const {
      title,
      description,
      dueDate,
      priority,
      category
    } = req.body;


    // -------------------------
    // Validate title
    // -------------------------

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Title is required"
      });
    }


    // -------------------------
    // Validate priority
    // -------------------------

    if (
      priority &&
      !ALLOWED_PRIORITIES.includes(priority)
    ) {
      return res.status(400).json({
        message:
          "Priority must be high, medium, or low"
      });
    }


    // -------------------------
    // Validate due date
    // -------------------------

    if (
      dueDate &&
      isNaN(new Date(dueDate).getTime())
    ) {
      return res.status(400).json({
        message: "Invalid due date"
      });
    }


    // -------------------------
    // Create Todo
    // -------------------------

    const todo = await Todo.create({
      title: title.trim(),

      description:
        description || "",

      dueDate:
        dueDate || null,

      priority:
        priority || "medium",

      category:
        category || null,

      completed: false,

      deleted: false,

      user: req.user._id
    });


    const populatedTodo =
      await todo.populate("category");


    res.status(201).json({
      message: "Todo created successfully",
      todo: populatedTodo
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to create todo"
    });
  }
};



// =========================
// Get All Todos
// Search + Status Filter
// =========================

const getTodos = async (req, res) => {
  try {

    const {
      search,
      status
    } = req.query;


    // -------------------------
    // Base filter
    // -------------------------

    const filter = {
      user: req.user._id,

      // Include old Todos that don't
      // have the deleted field
      deleted: {
        $ne: true
      }
    };


    // -------------------------
    // Search
    // -------------------------

    if (
      search &&
      search.trim()
    ) {

      const searchText =
        search.trim();


      filter.$or = [

        {
          title: {
            $regex: searchText,
            $options: "i"
          }
        },

        {
          description: {
            $regex: searchText,
            $options: "i"
          }
        }

      ];
    }


    // -------------------------
    // Status filter
    // -------------------------

    if (status === "all") {

      // No additional filter

    } else if (status === "active") {

      filter.completed = false;

    } else if (status === "completed") {

      filter.completed = true;

    } else if (status === "overdue") {

      filter.completed = false;

      filter.dueDate = {
        $ne: null,
        $lt: new Date()
      };

    } else if (status) {

      return res.status(400).json({
        message:
          "Invalid status. Use all, active, completed, or overdue"
      });
    }


    // -------------------------
    // Get Todos
    // -------------------------

    const todos = await Todo.find(filter)
      .populate("category")
      .sort({
        createdAt: -1
      });


    // -------------------------
    // Add overdue property
    // -------------------------

    const now = new Date();


    const formattedTodos =
      todos.map(todo => {

        const overdue =
          !todo.completed &&
          todo.dueDate &&
          new Date(todo.dueDate) < now;


        return {
          ...todo.toObject(),

          overdue:
            Boolean(overdue)
        };
      });


    res.json(formattedTodos);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to fetch todos"
    });
  }
};



// =========================
// Get Single Todo
// =========================

const getTodo = async (req, res) => {
  try {

    const todo = await Todo.findOne({
      _id: req.params.id,

      user: req.user._id,

      deleted: {
        $ne: true
      }

    }).populate("category");


    if (!todo) {

      return res.status(404).json({
        message: "Todo not found"
      });
    }


    // -------------------------
    // Calculate overdue
    // -------------------------

    const overdue =
      !todo.completed &&
      todo.dueDate &&
      new Date(todo.dueDate) < new Date();


    res.json({
      ...todo.toObject(),

      overdue:
        Boolean(overdue)
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to fetch todo"
    });
  }
};



// =========================
// Update Todo
// =========================

const updateTodo = async (req, res) => {
  try {

    const todo = await Todo.findOne({
      _id: req.params.id,

      user: req.user._id,

      deleted: {
        $ne: true
      }
    });


    if (!todo) {

      return res.status(404).json({
        message: "Todo not found"
      });
    }


    const {
      title,
      description,
      dueDate,
      priority,
      category,
      completed
    } = req.body;


    // -------------------------
    // Update title
    // -------------------------

    if (title !== undefined) {

      if (!title.trim()) {

        return res.status(400).json({
          message: "Title cannot be empty"
        });
      }

      todo.title =
        title.trim();
    }


    // -------------------------
    // Update description
    // -------------------------

    if (
      description !== undefined
    ) {

      todo.description =
        description;
    }


    // -------------------------
    // Update due date
    // -------------------------

    if (
      dueDate !== undefined
    ) {

      if (
        dueDate &&
        isNaN(
          new Date(dueDate).getTime()
        )
      ) {

        return res.status(400).json({
          message: "Invalid due date"
        });
      }

      todo.dueDate =
        dueDate || null;
    }


    // -------------------------
    // Update priority
    // -------------------------

    if (
      priority !== undefined
    ) {

      if (
        !ALLOWED_PRIORITIES.includes(
          priority
        )
      ) {

        return res.status(400).json({
          message:
            "Priority must be high, medium, or low"
        });
      }

      todo.priority =
        priority;
    }


    // -------------------------
    // Update category
    // -------------------------

    if (
      category !== undefined
    ) {

      todo.category =
        category || null;
    }


    // -------------------------
    // Update completed
    // -------------------------

    if (
      completed !== undefined
    ) {

      if (
        typeof completed !== "boolean"
      ) {

        return res.status(400).json({
          message:
            "Completed must be true or false"
        });
      }

      todo.completed =
        completed;
    }


    await todo.save();


    const updatedTodo =
      await todo.populate(
        "category"
      );


    // -------------------------
    // Calculate overdue
    // -------------------------

    const overdue =
      !updatedTodo.completed &&
      updatedTodo.dueDate &&
      new Date(updatedTodo.dueDate)
        < new Date();


    res.json({

      message:
        "Todo updated successfully",

      todo: {
        ...updatedTodo.toObject(),

        overdue:
          Boolean(overdue)
      }

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to update todo"
    });
  }
};



// =========================
// Soft Delete Todo
// =========================

const deleteTodo = async (req, res) => {
  try {

    const todo = await Todo.findOne({
      _id: req.params.id,

      user: req.user._id,

      deleted: {
        $ne: true
      }
    });


    if (!todo) {

      return res.status(404).json({
        message: "Todo not found"
      });
    }


    // Soft delete
    todo.deleted = true;

    await todo.save();


    res.json({
      message:
        "Todo moved to trash"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message:
        "Failed to delete todo"
    });
  }
};



// =========================
// Toggle Complete / Incomplete
// =========================

const toggleTodo = async (req, res) => {
  try {

    const todo = await Todo.findOne({
      _id: req.params.id,

      user: req.user._id,

      deleted: {
        $ne: true
      }
    });


    if (!todo) {

      return res.status(404).json({
        message: "Todo not found"
      });
    }


    // Toggle
    todo.completed =
      !todo.completed;


    await todo.save();


    const updatedTodo =
      await todo.populate(
        "category"
      );


    // Calculate overdue
    const overdue =
      !updatedTodo.completed &&
      updatedTodo.dueDate &&
      new Date(updatedTodo.dueDate)
        < new Date();


    res.json({

      message:
        updatedTodo.completed
          ? "Todo marked as completed"
          : "Todo marked as incomplete",

      todo: {
        ...updatedTodo.toObject(),

        overdue:
          Boolean(overdue)
      }

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message:
        "Failed to toggle todo"
    });
  }
};



// =========================
// Export
// =========================

module.exports = {

  createTodo,

  getTodos,

  getTodo,

  updateTodo,

  deleteTodo,

  toggleTodo

};