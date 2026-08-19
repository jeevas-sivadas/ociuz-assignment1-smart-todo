const Todo = require("../models/Todo");


// =========================
// Get Todo Statistics
// =========================

const getStatistics = async (req, res) => {
  try {

    // =========================
    // Current Time
    // =========================

    const now = new Date();


    // =========================
    // Start of Today
    // =========================

    const startOfToday = new Date(now);

    startOfToday.setHours(
      0,
      0,
      0,
      0
    );


    // =========================
    // End of Today
    // =========================

    const endOfToday = new Date(now);

    endOfToday.setHours(
      23,
      59,
      59,
      999
    );


    // =========================
    // Start of Tomorrow
    // =========================

    const startOfTomorrow = new Date(
      startOfToday
    );

    startOfTomorrow.setDate(
      startOfTomorrow.getDate() + 1
    );


    // =========================
    // End of Tomorrow
    // =========================

    const endOfTomorrow = new Date(
      startOfTomorrow
    );

    endOfTomorrow.setHours(
      23,
      59,
      59,
      999
    );


    // =========================
    // Base Filter
    // =========================
    // IMPORTANT:
    // Only current user's todos
    // and exclude deleted todos.

    const baseFilter = {
      user: req.user._id,
      deleted: {
        $ne: true
      }
    };


    // =========================
    // Get All Todos
    // =========================

    const todos = await Todo.find(
      baseFilter
    ).populate("category");


    // =========================
    // Basic Statistics
    // =========================

    const total = todos.length;


    const completed =
      todos.filter(
        todo => todo.completed
      ).length;


    const active =
      todos.filter(
        todo => !todo.completed
      ).length;


    // =========================
    // Overdue
    // =========================

    const overdue =
      todos.filter(todo =>
        !todo.completed &&
        todo.dueDate &&
        new Date(todo.dueDate) < now
      ).length;


    // =========================
    // Due Today
    // =========================

    const dueToday =
      todos.filter(todo =>
        !todo.completed &&
        todo.dueDate &&
        new Date(todo.dueDate) >= startOfToday &&
        new Date(todo.dueDate) <= endOfToday
      ).length;


    // =========================
    // Due Tomorrow
    // =========================

    const dueTomorrow =
      todos.filter(todo =>
        !todo.completed &&
        todo.dueDate &&
        new Date(todo.dueDate) >= startOfTomorrow &&
        new Date(todo.dueDate) <= endOfTomorrow
      ).length;


    // =========================
    // Upcoming
    // =========================

    const upcoming =
      todos.filter(todo =>
        !todo.completed &&
        todo.dueDate &&
        new Date(todo.dueDate) > endOfTomorrow
      ).length;


    // =========================
    // No Due Date
    // =========================

    const noDueDate =
      todos.filter(todo =>
        !todo.dueDate
      ).length;


    // =========================
    // Priority Statistics
    // =========================

    const high =
      todos.filter(
        todo => todo.priority === "high"
      ).length;


    const medium =
      todos.filter(
        todo => todo.priority === "medium"
      ).length;


    const low =
      todos.filter(
        todo => todo.priority === "low"
      ).length;


    // =========================
    // Completion Percentage
    // =========================

    const completionPercentage =
      total === 0
        ? 0
        : Math.round(
            (completed / total) * 100
          );


    // =========================
    // Category Statistics
    // =========================

    const categoryStats = {};


    todos.forEach(todo => {

      if (todo.category) {

        const categoryId =
          todo.category._id.toString();

        const categoryName =
          todo.category.name;

        const categoryColor =
          todo.category.color ||
          "#6366f1";


        if (!categoryStats[categoryId]) {

          categoryStats[categoryId] = {

            id: categoryId,

            name: categoryName,

            color: categoryColor,

            total: 0,

            completed: 0,

            active: 0

          };

        }


        categoryStats[categoryId].total += 1;


        if (todo.completed) {

          categoryStats[categoryId]
            .completed += 1;

        } else {

          categoryStats[categoryId]
            .active += 1;

        }

      }

    });


    // =========================
    // Convert Category Object
    // to Array
    // =========================

    const categories =
      Object.values(categoryStats);


    // =========================
    // Response
    // =========================

    res.json({

      total,

      active,

      completed,

      overdue,

      dueToday,

      dueTomorrow,

      upcoming,

      noDueDate,

      completionPercentage,

      priority: {

        high,

        medium,

        low

      },

      categories

    });


  } catch (error) {

    console.error(
      "Statistics error:",
      error
    );


    res.status(500).json({

      message:
        "Failed to fetch statistics"

    });

  }
};


module.exports = {
  getStatistics
};