const Todo = require("../models/Todo");


// =========================
// Allowed Priority Levels
// =========================

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


    // -------------------------
    // Populate Category
    // -------------------------

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
// Search + Status + Category + Due Date
// =========================

const getTodos = async (req, res) => {
  try {

    const {
      search,
      status,
      category,
      dueDate
    } = req.query;


    // -------------------------
    // Base Filter
    // -------------------------

    const filter = {
      user: req.user._id,

      // Include old todos that don't
      // have the deleted field
      deleted: {
        $ne: true
      }
    };


    // We use $and so that
    // multiple filters can work together.
    const conditions = [];


    // =========================
    // Search Filter
    // =========================

    if (
      search &&
      search.trim()
    ) {

      const searchText =
        search.trim();


      conditions.push({
        $or: [
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
        ]
      });
    }


    // =========================
    // Status Filter
    // =========================

    if (
      status &&
      status !== "all"
    ) {

      if (status === "active") {

        conditions.push({
          completed: false
        });

      }

      else if (status === "completed") {

        conditions.push({
          completed: true
        });

      }

      else if (status === "overdue") {

        conditions.push({
          completed: false
        });

        conditions.push({
          dueDate: {
            $ne: null,
            $lt: new Date()
          }
        });

      }

      else {

        return res.status(400).json({
          message:
            "Invalid status. Use all, active, completed, or overdue"
        });
      }
    }


    // =========================
    // Category Filter
    // =========================

    if (
      category &&
      category !== "all"
    ) {

      conditions.push({
        category: category
      });
    }


    // =========================
    // Due Date Filter
    // =========================

    if (
      dueDate &&
      dueDate !== "all"
    ) {

      const now = new Date();


      // -------------------------
      // Today
      // -------------------------

      if (dueDate === "today") {

        const startOfDay =
          new Date(now);

        startOfDay.setHours(
          0,
          0,
          0,
          0
        );


        const endOfDay =
          new Date(now);

        endOfDay.setHours(
          23,
          59,
          59,
          999
        );


        conditions.push({
          dueDate: {
            $gte: startOfDay,
            $lte: endOfDay
          }
        });
      }


      // -------------------------
      // Tomorrow
      // -------------------------

      else if (
        dueDate === "tomorrow"
      ) {

        const startOfTomorrow =
          new Date(now);

        startOfTomorrow.setDate(
          startOfTomorrow.getDate() + 1
        );

        startOfTomorrow.setHours(
          0,
          0,
          0,
          0
        );


        const endOfTomorrow =
          new Date(startOfTomorrow);

        endOfTomorrow.setHours(
          23,
          59,
          59,
          999
        );


        conditions.push({
          dueDate: {
            $gte: startOfTomorrow,
            $lte: endOfTomorrow
          }
        });
      }


      // -------------------------
      // Upcoming
      // -------------------------

      else if (
        dueDate === "upcoming"
      ) {

        conditions.push({
          dueDate: {
            $gt: now
          }
        });
      }


      // -------------------------
      // No Due Date
      // -------------------------

      else if (
        dueDate === "none"
      ) {

        conditions.push({
          $or: [
            {
              dueDate: null
            },

            {
              dueDate: {
                $exists: false
              }
            }
          ]
        });
      }


      // -------------------------
      // Overdue
      // -------------------------

      else if (
        dueDate === "overdue"
      ) {

        conditions.push({
          completed: false
        });

        conditions.push({
          dueDate: {
            $ne: null,
            $lt: now
          }
        });
      }


      // -------------------------
      // Invalid Due Date Filter
      // -------------------------

      else {

        return res.status(400).json({
          message:
            "Invalid dueDate. Use all, today, tomorrow, upcoming, overdue, or none"
        });
      }
    }


    // =========================
    // Apply Conditions
    // =========================

    if (conditions.length > 0) {

      filter.$and = conditions;
    }


    // =========================
    // Get Todos
    // =========================

    const todos =
      await Todo.find(filter)
        .populate("category")
        .sort({
          createdAt: -1
        });


    // =========================
    // Add Overdue Property
    // =========================

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


    // =========================
    // Response
    // =========================

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

    const todo =
      await Todo.findOne({

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
    // Calculate Overdue
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

    const todo =
      await Todo.findOne({

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


    // =========================
    // Update Title
    // =========================

    if (title !== undefined) {

      if (!title.trim()) {

        return res.status(400).json({
          message: "Title cannot be empty"
        });
      }

      todo.title =
        title.trim();
    }


    // =========================
    // Update Description
    // =========================

    if (
      description !== undefined
    ) {

      todo.description =
        description;
    }


    // =========================
    // Update Due Date
    // =========================

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


    // =========================
    // Update Priority
    // =========================

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


    // =========================
    // Update Category
    // =========================

    if (
      category !== undefined
    ) {

      todo.category =
        category || null;
    }


    // =========================
    // Update Completed
    // =========================

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


    // =========================
    // Save
    // =========================

    await todo.save();


    // =========================
    // Populate Category
    // =========================

    const updatedTodo =
      await todo.populate(
        "category"
      );


    // =========================
    // Calculate Overdue
    // =========================

    const overdue =
      !updatedTodo.completed &&
      updatedTodo.dueDate &&
      new Date(updatedTodo.dueDate)
        < new Date();


    // =========================
    // Response
    // =========================

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

    const todo =
      await Todo.findOne({

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


    // -------------------------
    // Soft Delete
    // -------------------------

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

    const todo =
      await Todo.findOne({

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


    // -------------------------
    // Toggle
    // -------------------------

    todo.completed =
      !todo.completed;


    await todo.save();


    // -------------------------
    // Populate Category
    // -------------------------

    const updatedTodo =
      await todo.populate(
        "category"
      );


    // -------------------------
    // Calculate Overdue
    // -------------------------

    const overdue =
      !updatedTodo.completed &&
      updatedTodo.dueDate &&
      new Date(updatedTodo.dueDate)
        < new Date();


    // -------------------------
    // Response
    // -------------------------

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