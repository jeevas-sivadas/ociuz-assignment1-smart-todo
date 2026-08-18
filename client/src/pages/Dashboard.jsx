import { useEffect, useState } from "react";

import {
  getTodos,
  createTodo,
  updateTodo,
  toggleTodo,
  deleteTodo
} from "../services/todoService";

import {
  getCategories,
  createCategory
} from "../services/categoryService";


function Dashboard() {

  // =========================
  // Empty Todo Form
  // =========================

  const emptyForm = {
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
    category: ""
  };


  // =========================
  // User
  // =========================

  const [user, setUser] = useState(null);


  // =========================
  // Todo Form State
  // =========================

  const [formData, setFormData] =
    useState(emptyForm);

  const [showForm, setShowForm] =
    useState(false);

  const [editingTodoId, setEditingTodoId] =
    useState(null);

  const [formLoading, setFormLoading] =
    useState(false);

  const [formError, setFormError] =
    useState("");


  // =========================
  // Todos
  // =========================

  const [todos, setTodos] =
    useState([]);

  const [todoLoading, setTodoLoading] =
    useState(true);

  const [todoError, setTodoError] =
    useState("");


  // =========================
  // Categories
  // =========================

  const [categories, setCategories] =
    useState([]);

  const [categoryLoading, setCategoryLoading] =
    useState(true);


  // =========================
  // Custom Category
  // =========================

  const [showCategoryForm, setShowCategoryForm] =
    useState(false);

  const [categoryName, setCategoryName] =
    useState("");

  const [categoryColor, setCategoryColor] =
    useState("#6366f1");

  const [categoryError, setCategoryError] =
    useState("");

  const [categoryCreating, setCategoryCreating] =
    useState(false);


  // =========================
  // Search / Filters
  // =========================

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("all");

  const [selectedCategory, setSelectedCategory] =
    useState("all");

  const [dueDateFilter, setDueDateFilter] =
    useState("all");


  // =========================
  // Load User
  // =========================

  useEffect(() => {

    const token =
      localStorage.getItem("token");

    const storedUser =
      localStorage.getItem("user");


    // No token = not logged in
    if (!token) {

      window.location.href = "/";

      return;
    }


    // Try to load user
    if (storedUser) {

      try {

        const parsedUser =
          JSON.parse(storedUser);

        setUser(parsedUser);

      } catch (error) {

        console.error(
          "Failed to parse stored user:",
          error
        );

        localStorage.removeItem("user");
      }
    }

  }, []);


  // =========================
  // Load Categories
  // =========================

  const loadCategories = async () => {

    try {

      setCategoryLoading(true);

      const token =
        localStorage.getItem("token");


      if (!token) {

        setCategoryLoading(false);

        return;
      }


      const data =
        await getCategories(token);


      setCategories(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {

      console.error(
        "Failed to load categories:",
        error.response?.data ||
        error.message
      );

      setCategories([]);

    } finally {

      setCategoryLoading(false);
    }
  };


  // =========================
  // Load Todos
  // =========================

  const loadTodos = async () => {

    try {

      setTodoLoading(true);

      setTodoError("");


      const token =
        localStorage.getItem("token");


      if (!token) {

        setTodoError(
          "You are not logged in."
        );

        setTodos([]);

        return;
      }


      // =========================
      // Filter Parameters
      // =========================

      const params = {

        search:
          search.trim(),

        status,

        category:
          selectedCategory,

        dueDate:
          dueDateFilter

      };


      console.log(
        "TODO FILTERS:",
        params
      );


      // =========================
      // Get Todos
      // =========================

      const data =
        await getTodos(
          params,
          token
        );


      setTodos(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {

      console.error(
        "Failed to load todos:",
        error.response?.data ||
        error.message
      );


      setTodoError(
        error.response?.data?.message ||
        "Failed to load todos"
      );


      setTodos([]);

    } finally {

      setTodoLoading(false);
    }
  };


  // =========================
  // Initial Load
  // =========================

  useEffect(() => {

    loadCategories();

  }, []);


  // =========================
  // Load Todos
  // Filter Changes
  // =========================

  useEffect(() => {

    const timer =
      setTimeout(() => {

        loadTodos();

      }, 300);


    return () =>
      clearTimeout(timer);

  }, [
    search,
    status,
    selectedCategory,
    dueDateFilter
  ]);


  // =========================
  // Handle Form Input
  // =========================

  const handleChange = (e) => {

    const {
      name,
      value
    } = e.target;


    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };


  // =========================
  // Open Create Form
  // =========================

  const openCreateForm = () => {

    setEditingTodoId(null);

    setFormData({
      ...emptyForm
    });

    setFormError("");

    setShowCategoryForm(false);

    setCategoryError("");

    setShowForm(true);


    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };


  // =========================
  // Open Edit Form
  // =========================

  const handleEdit = (todo) => {

    let formattedDate = "";


    if (todo.dueDate) {

      const date =
        new Date(todo.dueDate);


      if (!isNaN(date.getTime())) {

        formattedDate =
          date
            .toISOString()
            .split("T")[0];
      }
    }


    setEditingTodoId(
      todo._id
    );


    setFormData({

      title:
        todo.title || "",

      description:
        todo.description || "",

      dueDate:
        formattedDate,

      priority:
        todo.priority || "medium",

      category:
        todo.category?._id ||
        todo.category ||
        ""

    });


    setFormError("");

    setShowCategoryForm(false);

    setCategoryError("");

    setShowForm(true);


    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };


  // =========================
  // Close Form
  // =========================

  const closeForm = () => {

    if (formLoading) {
      return;
    }


    setShowForm(false);

    setEditingTodoId(null);

    setFormData({
      ...emptyForm
    });

    setFormError("");

    setShowCategoryForm(false);

    setCategoryName("");

    setCategoryColor("#6366f1");

    setCategoryError("");
  };


  // =========================
  // Create / Update Todo
  // =========================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setFormError("");


    if (!formData.title.trim()) {

      setFormError(
        "Title is required."
      );

      return;
    }


    try {

      setFormLoading(true);


      const token =
        localStorage.getItem("token");


      if (!token) {

        setFormError(
          "You are not logged in."
        );

        return;
      }


      const todoData = {

        title:
          formData.title.trim(),

        description:
          formData.description.trim(),

        dueDate:
          formData.dueDate || null,

        priority:
          formData.priority,

        category:
          formData.category || null

      };


      // UPDATE

      if (editingTodoId) {

        await updateTodo(
          editingTodoId,
          todoData,
          token
        );

      }

      // CREATE

      else {

        await createTodo(
          todoData,
          token
        );
      }


      closeForm();

      await loadTodos();

    } catch (error) {

      console.error(
        "Failed to save todo:",
        error.response?.data ||
        error.message
      );


      setFormError(
        error.response?.data?.message ||
        "Failed to save todo"
      );

    } finally {

      setFormLoading(false);
    }
  };


  // =========================
  // Toggle Todo
  // =========================

  const handleToggle = async (todoId) => {

    try {

      const token =
        localStorage.getItem("token");


      if (!token) {
        return;
      }


      await toggleTodo(
        todoId,
        token
      );


      await loadTodos();

    } catch (error) {

      console.error(
        "Failed to toggle todo:",
        error.response?.data ||
        error.message
      );
    }
  };


  // =========================
  // Delete Todo
  // =========================

  const handleDelete = async (todoId) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this todo?"
      );


    if (!confirmed) {
      return;
    }


    try {

      const token =
        localStorage.getItem("token");


      if (!token) {
        return;
      }


      await deleteTodo(
        todoId,
        token
      );


      await loadTodos();

    } catch (error) {

      console.error(
        "Failed to delete todo:",
        error.response?.data ||
        error.message
      );
    }
  };


  // =========================
  // Create Custom Category
  // =========================

  const handleCreateCategory =
    async () => {

      setCategoryError("");


      const trimmedName =
        categoryName.trim();


      if (!trimmedName) {

        setCategoryError(
          "Category name is required"
        );

        return;
      }


      try {

        setCategoryCreating(true);


        const token =
          localStorage.getItem("token");


        if (!token) {

          setCategoryError(
            "You are not logged in"
          );

          return;
        }


        const data =
          await createCategory(
            {
              name: trimmedName,
              color: categoryColor
            },
            token
          );


        const createdCategory =
          data?.category || data;


        await loadCategories();


        if (createdCategory?._id) {

          setFormData((prev) => ({
            ...prev,
            category:
              createdCategory._id
          }));
        }


        setCategoryName("");

        setCategoryColor("#6366f1");

        setCategoryError("");

        setShowCategoryForm(false);

      } catch (error) {

        console.error(
          "Failed to create category:",
          error.response?.data ||
          error.message
        );


        setCategoryError(
          error.response?.data?.message ||
          "Failed to create category"
        );

      } finally {

        setCategoryCreating(false);
      }
    };


  // =========================
  // Clear Filters
  // =========================

  const clearFilters = () => {

    setSearch("");

    setStatus("all");

    setSelectedCategory("all");

    setDueDateFilter("all");
  };


  // =========================
  // Active Filters
  // =========================

  const hasActiveFilters =
    search.trim() !== "" ||
    status !== "all" ||
    selectedCategory !== "all" ||
    dueDateFilter !== "all";


  // =========================
  // Logout
  // =========================

  const handleLogout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    setUser(null);

    window.location.href = "/";
  };


  // =========================
  // Priority Class
  // =========================

  const getPriorityClass = (priority) => {

    if (priority === "high") {

      return "bg-red-100 text-red-700";
    }


    if (priority === "low") {

      return "bg-green-100 text-green-700";
    }


    return "bg-yellow-100 text-yellow-700";
  };


  // =========================
  // Format Date
  // =========================

  const formatDate = (dateValue) => {

    if (!dateValue) {

      return "No due date";
    }


    const date =
      new Date(dateValue);


    if (isNaN(date.getTime())) {

      return "Invalid date";
    }


    return date.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }
    );
  };


  // =========================
  // User Initial
  // =========================

  const getUserInitial = () => {

    if (!user?.name) {
      return "U";
    }

    return user.name
      .charAt(0)
      .toUpperCase();
  };


  // =========================
  // Render
  // =========================

  return (

    <div className="min-h-screen bg-gray-100">


      {/* =========================
          Header
      ========================= */}

      <header className="bg-white border-b">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="h-20 flex items-center justify-between">


            {/* Logo */}

            <div>

              <h1 className="text-xl font-bold text-gray-900">
                Smart Todo
              </h1>

              <p className="text-xs text-gray-500">
                Manage your tasks
              </p>

            </div>


            {/* User + Logout */}

            <div className="flex items-center gap-4">


              {/* User Information */}

              {user && (

                <div className="hidden sm:flex items-center gap-3">


                  {/* Avatar */}

                  <div className="h-10 w-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                    {getUserInitial()}
                  </div>


                  {/* Name / Email */}

                  <div className="text-right">

                    <p className="text-sm font-semibold text-gray-900">
                      {user.name || "User"}
                    </p>

                    <p className="text-xs text-gray-500">
                      {user.email || ""}
                    </p>

                  </div>

                </div>

              )}


              {/* Mobile Avatar */}

              {user && (

                <div className="sm:hidden h-10 w-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                  {getUserInitial()}
                </div>

              )}


              {/* Logout */}

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
              >
                Logout
              </button>

            </div>

          </div>

        </div>

      </header>


      {/* =========================
          Main
      ========================= */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">


        {/* =========================
            Welcome
        ========================= */}

        <div className="mb-6">

          <h2 className="text-2xl font-bold text-gray-900">

            Hello,{" "}

            <span className="text-indigo-600">
              {user?.name || "User"}
            </span>

            👋

          </h2>

          <p className="text-gray-500 mt-1">
            Organize and manage your todos
          </p>

        </div>


        {/* =========================
            Page Header
        ========================= */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">

          <div>

            <h3 className="text-xl font-bold text-gray-900">
              My Tasks
            </h3>

            <p className="text-gray-500 mt-1">
              Create, organize and track your tasks
            </p>

          </div>


          <button
            type="button"
            onClick={openCreateForm}
            className="rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            + Add Todo
          </button>

        </div>


        {/* =========================
            Todo Form
        ========================= */}

        {showForm && (

          <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">


            <div className="flex items-center justify-between mb-6">

              <div>

                <h3 className="text-xl font-bold text-gray-900">

                  {editingTodoId
                    ? "Edit Todo"
                    : "Create Todo"}

                </h3>

                <p className="text-sm text-gray-500 mt-1">

                  {editingTodoId
                    ? "Update your task"
                    : "Add a new task to your list"}

                </p>

              </div>


              <button
                type="button"
                onClick={closeForm}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>

            </div>


            {formError && (

              <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                {formError}
              </div>

            )}


            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >


              {/* Title */}

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter todo title"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                />

              </div>


              {/* Description */}

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter description"
                  rows="4"
                  className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                />

              </div>


              {/* Due Date */}

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date
                </label>

                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                />

                <p className="mt-1 text-xs text-gray-500">
                  Tasks past their due date will automatically be marked overdue.
                </p>

              </div>


              {/* Priority */}

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>

                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                >

                  <option value="high">
                    High
                  </option>

                  <option value="medium">
                    Medium
                  </option>

                  <option value="low">
                    Low
                  </option>

                </select>

              </div>


              {/* Category */}

              <div>

                <div className="flex items-center justify-between mb-2">

                  <label className="block text-sm font-medium text-gray-700">
                    Category
                  </label>

                  <button
                    type="button"
                    onClick={() => {

                      setShowCategoryForm(
                        (prev) => !prev
                      );

                      setCategoryError("");

                    }}
                    className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                  >
                    + Custom Category
                  </button>

                </div>


                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  disabled={categoryLoading}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                >

                  <option value="">

                    {categoryLoading
                      ? "Loading categories..."
                      : "No category"}

                  </option>


                  {!categoryLoading &&
                    categories.map(
                      (category) => (

                        <option
                          key={category._id}
                          value={category._id}
                        >
                          {category.name}
                        </option>

                      )
                    )}

                </select>


                {/* Custom Category */}

                {showCategoryForm && (

                  <div className="mt-4 rounded-lg border border-indigo-100 bg-indigo-50 p-4">

                    <h4 className="font-semibold text-gray-900 mb-4">
                      Create Custom Category
                    </h4>


                    {categoryError && (

                      <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-600">
                        {categoryError}
                      </div>

                    )}


                    <div className="space-y-4">


                      {/* Category Name */}

                      <div>

                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Category Name
                        </label>

                        <input
                          type="text"
                          value={categoryName}
                          onChange={(e) =>
                            setCategoryName(
                              e.target.value
                            )
                          }
                          placeholder="e.g. Fitness"
                          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                        />

                      </div>


                      {/* Category Color */}

                      <div>

                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Category Color
                        </label>

                        <div className="flex items-center gap-3">

                          <input
                            type="color"
                            value={categoryColor}
                            onChange={(e) =>
                              setCategoryColor(
                                e.target.value
                              )
                            }
                            className="h-10 w-16 cursor-pointer rounded border border-gray-300"
                          />

                          <span className="text-sm text-gray-600">
                            {categoryColor}
                          </span>

                        </div>

                      </div>


                      {/* Buttons */}

                      <div className="flex gap-3">

                        <button
                          type="button"
                          onClick={
                            handleCreateCategory
                          }
                          disabled={
                            categoryCreating
                          }
                          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >

                          {categoryCreating
                            ? "Creating..."
                            : "Create Category"}

                        </button>


                        <button
                          type="button"
                          onClick={() => {

                            setShowCategoryForm(false);

                            setCategoryError("");

                            setCategoryName("");

                          }}
                          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                        >
                          Cancel
                        </button>

                      </div>

                    </div>

                  </div>

                )}

              </div>


              {/* Form Buttons */}

              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">

                <button
                  type="button"
                  onClick={closeForm}
                  disabled={formLoading}
                  className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  disabled={formLoading}
                  className="rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >

                  {formLoading
                    ? editingTodoId
                      ? "Updating..."
                      : "Creating..."
                    : editingTodoId
                    ? "Update Todo"
                    : "Create Todo"}

                </button>

              </div>

            </form>

          </div>

        )}


        {/* =========================
            Filters
        ========================= */}

        <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">


          {/* Search */}

          <div className="mb-4">

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search todos by title or description..."
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
            />

          </div>


          {/* Filter Row */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">


            {/* Status */}

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
              >

                <option value="all">
                  All
                </option>

                <option value="active">
                  Active
                </option>

                <option value="completed">
                  Completed
                </option>

                <option value="overdue">
                  Overdue
                </option>

              </select>

            </div>


            {/* Category */}

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>

              <select
                value={selectedCategory}
                onChange={(e) =>
                  setSelectedCategory(
                    e.target.value
                  )
                }
                disabled={categoryLoading}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
              >

                <option value="all">
                  All Categories
                </option>


                {!categoryLoading &&
                  categories.map(
                    (category) => (

                      <option
                        key={category._id}
                        value={category._id}
                      >
                        {category.name}
                      </option>

                    )
                  )}

              </select>

            </div>


            {/* Due Date */}

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date
              </label>

              <select
                value={dueDateFilter}
                onChange={(e) =>
                  setDueDateFilter(
                    e.target.value
                  )
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
              >

                <option value="all">
                  All Due Dates
                </option>

                <option value="today">
                  Today
                </option>

                <option value="tomorrow">
                  Tomorrow
                </option>

                <option value="upcoming">
                  Upcoming
                </option>

                <option value="overdue">
                  Overdue
                </option>

                <option value="none">
                  No Due Date
                </option>

              </select>

            </div>

          </div>


          {/* Clear Filters */}

          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

            <div className="text-sm text-gray-500">

              {hasActiveFilters
                ? "Filters are active"
                : "Showing all todos"}

            </div>


            {hasActiveFilters && (

              <button
                type="button"
                onClick={clearFilters}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Clear Filters
              </button>

            )}

          </div>

        </div>


        {/* =========================
            Error
        ========================= */}

        {todoError && (

          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
            {todoError}
          </div>

        )}


        {/* =========================
            Loading
        ========================= */}

        {todoLoading && (

          <div className="bg-white rounded-xl shadow-sm border p-8 text-center">

            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600" />

            <p className="mt-3 text-gray-500">
              Loading todos...
            </p>

          </div>

        )}


        {/* =========================
            Empty
        ========================= */}

        {!todoLoading &&
          todos.length === 0 && (

            <div className="bg-white rounded-xl shadow-sm border p-8 text-center">

              <div className="text-4xl mb-3">
                📝
              </div>

              <h3 className="text-lg font-semibold text-gray-900">
                No todos found
              </h3>

              <p className="text-gray-500 mt-2">

                {hasActiveFilters
                  ? "Try changing or clearing your filters."
                  : "Create your first todo to get started."}

              </p>


              {hasActiveFilters && (

                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  Clear Filters
                </button>

              )}

            </div>

          )}


        {/* =========================
            Todo List
        ========================= */}

        {!todoLoading &&
          todos.length > 0 && (

            <div className="space-y-4">

              {todos.map((todo) => (

                <div
                  key={todo._id}
                  className={`bg-white rounded-xl shadow-sm border p-5 transition ${
                    todo.completed
                      ? "opacity-75"
                      : ""
                  } ${
                    todo.overdue
                      ? "border-red-300"
                      : "border-gray-200"
                  }`}
                >


                  <div className="flex items-start gap-4">


                    {/* Complete */}

                    <button
                      type="button"
                      onClick={() =>
                        handleToggle(
                          todo._id
                        )
                      }
                      className={`mt-1 h-6 w-6 flex-shrink-0 rounded-full border-2 flex items-center justify-center transition ${
                        todo.completed
                          ? "bg-green-500 border-green-500 text-white"
                          : "border-gray-300 hover:border-indigo-500"
                      }`}
                      title={
                        todo.completed
                          ? "Mark incomplete"
                          : "Mark complete"
                      }
                    >

                      {todo.completed && (

                        <span className="text-sm">
                          ✓
                        </span>

                      )}

                    </button>


                    {/* Content */}

                    <div className="flex-1 min-w-0">

                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">


                        <div>

                          <h3
                            className={`text-lg font-semibold break-words ${
                              todo.completed
                                ? "line-through text-gray-400"
                                : "text-gray-900"
                            }`}
                          >
                            {todo.title}
                          </h3>


                          {todo.description && (

                            <p className="mt-1 text-sm text-gray-500 break-words">
                              {todo.description}
                            </p>

                          )}

                        </div>


                        {/* Actions */}

                        <div className="flex items-center gap-2 flex-shrink-0">


                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(todo)
                            }
                            className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-100"
                          >
                            ✏ Edit
                          </button>


                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                todo._id
                              )
                            }
                            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
                          >
                            🗑 Delete
                          </button>

                        </div>

                      </div>


                      {/* Metadata */}

                      <div className="flex flex-wrap items-center gap-2 mt-4">


                        {/* Priority */}

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getPriorityClass(
                            todo.priority
                          )}`}
                        >
                          {todo.priority} priority
                        </span>


                        {/* Category */}

                        {todo.category && (

                          <span
                            className="rounded-full px-3 py-1 text-xs font-semibold text-white"
                            style={{
                              backgroundColor:
                                todo.category.color ||
                                "#6366f1"
                            }}
                          >
                            {todo.category.name}
                          </span>

                        )}


                        {/* Due Date */}

                        {todo.dueDate && (

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              todo.overdue
                                ? "bg-red-100 text-red-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >

                            {todo.overdue
                              ? "⚠ Overdue · "
                              : "Due · "}

                            {formatDate(
                              todo.dueDate
                            )}

                          </span>

                        )}


                        {/* No Due Date */}

                        {!todo.dueDate && (

                          <span className="rounded-full bg-gray-100 text-gray-500 px-3 py-1 text-xs font-semibold">
                            No due date
                          </span>

                        )}


                        {/* Completed */}

                        {todo.completed && (

                          <span className="rounded-full bg-green-100 text-green-700 px-3 py-1 text-xs font-semibold">
                            ✓ Completed
                          </span>

                        )}

                      </div>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

      </main>

    </div>
  );
}


export default Dashboard;