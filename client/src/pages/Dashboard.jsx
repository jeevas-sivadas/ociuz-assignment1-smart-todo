
import {
  useCallback,
  useEffect,
  useState
} from "react";

// Services
import {
  getTodos,
  createTodo,
  updateTodo,
  toggleTodo,
  deleteTodo
} from "../services/todoService";

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from "../services/categoryService";

import {
  getStatistics
} from "../services/statisticsService";

// Utilities
import {
  formatDateForInput
} from "../utils/dateUtils";

// Dashboard Components
import StatisticsPanel from "../components/dashboard/StatisticsPanel";
import TodoForm from "../components/dashboard/TodoForm";
import TodoFilters from "../components/dashboard/TodoFilters";
import Toast from "../components/dashboard/Toast";
import DeleteConfirmation from "../components/dashboard/DeleteConfirmation";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardPageHeader from "../components/dashboard/DashboardPageHeader";
import TodoListSection from "../components/dashboard/TodoListSection";

// Default Form Data
const EMPTY_FORM = {
  title: "",
  description: "",
  dueDate: "",
  priority: "medium",
  category: ""
};

// Default Statistics Data
const EMPTY_STATISTICS = {
  total: 0,
  active: 0,
  completed: 0,
  overdue: 0,
  dueToday: 0,
  dueTomorrow: 0,
  upcoming: 0,
  noDueDate: 0,
  completionPercentage: 0,
  priority: {
    high: 0,
    medium: 0,
    low: 0
  },
  categories: []
};

// Get Authentication Token
const getToken = () => localStorage.getItem("token");


function Dashboard() {

  // User State
  const [user, setUser] = useState(null);

  // Todo Form State
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [showForm, setShowForm] = useState(false);
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  // Todo List State
  const [todos, setTodos] = useState([]);
  const [todoLoading, setTodoLoading] = useState(true);
  const [todoError, setTodoError] = useState("");

  // Category State
  const [categories, setCategories] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(true);

  // Category Form State
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categoryColor, setCategoryColor] = useState("#6366f1");
  const [categoryError, setCategoryError] = useState("");
  const [categoryCreating, setCategoryCreating] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [categoryDeleting, setCategoryDeleting] = useState(false);

  // Filter State
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [dueDateFilter, setDueDateFilter] = useState("all");

  // Statistics State
  const [statistics, setStatistics] = useState(EMPTY_STATISTICS);
  const [statisticsLoading, setStatisticsLoading] = useState(true);
  const [statisticsError, setStatisticsError] = useState("");
  const [showStatistics, setShowStatistics] = useState(true);

  // Dashboard Refresh State
  const [refreshing, setRefreshing] = useState(false);

  // Toast State
  const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: ""
  });

  // Delete Todo State
  const [deleteTodoId, setDeleteTodoId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);


  // Check Active Filters
  const hasActiveFilters =
    search.trim() !== "" ||
    status !== "all" ||
    selectedCategory !== "all" ||
    dueDateFilter !== "all";


  // Show Toast Message
  const showToast = useCallback((message, type = "success") => {

    setToast({
      show: true,
      type,
      message
    });

    setTimeout(() => {
      setToast({
        show: false,
        type: "success",
        message: ""
      });
    }, 3000);

  }, []);


  // Reset Category Form
  const resetCategoryForm = () => {
    setShowCategoryForm(false);
    setEditingCategoryId(null);
    setCategoryName("");
    setCategoryColor("#6366f1");
    setCategoryError("");
  };


  // Reset Todo Form
  const resetForm = () => {
    setFormData(EMPTY_FORM);
    setEditingTodoId(null);
    setFormError("");
    resetCategoryForm();
  };


  // Check Authentication
  useEffect(() => {

    const token = getToken();
    const storedUser = localStorage.getItem("user");

    if (!token) {
      window.location.href = "/";
      return;
    }

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("user");
      }
    }

  }, []);


  // Load Categories
  const loadCategories = useCallback(async () => {

    try {

      setCategoryLoading(true);

      const token = getToken();

      if (!token) return;

      const data = await getCategories(token);

      setCategories(Array.isArray(data) ? data : []);

    } catch (error) {

      console.error(
        "Failed to load categories:",
        error.response?.data || error.message
      );

      setCategories([]);

    } finally {

      setCategoryLoading(false);

    }

  }, []);


  // Load Todos
  const loadTodos = useCallback(async () => {

    try {

      setTodoLoading(true);
      setTodoError("");

      const token = getToken();

      if (!token) {
        setTodoError("You are not logged in.");
        setTodos([]);
        return;
      }

      const params = {
        search: search.trim(),
        status,
        category: selectedCategory,
        dueDate: dueDateFilter
      };

      const data = await getTodos(params, token);

      setTodos(Array.isArray(data) ? data : []);

    } catch (error) {

      console.error(
        "Failed to load todos:",
        error.response?.data || error.message
      );

      const message =
        error.response?.data?.message || "Failed to load todos";

      setTodoError(message);
      showToast(message, "error");
      setTodos([]);

    } finally {

      setTodoLoading(false);

    }

  }, [
    search,
    status,
    selectedCategory,
    dueDateFilter,
    showToast
  ]);


  // Load Statistics
  const loadStatistics = useCallback(async () => {

    try {

      setStatisticsLoading(true);
      setStatisticsError("");

      const token = getToken();

      if (!token) {
        setStatisticsError("You are not logged in.");
        return;
      }

      const data = await getStatistics(token);

      setStatistics({
        ...EMPTY_STATISTICS,
        ...data,
        priority: {
          ...EMPTY_STATISTICS.priority,
          ...data?.priority
        },
        categories: Array.isArray(data?.categories)
          ? data.categories
          : []
      });

    } catch (error) {

      const message =
        error.response?.data?.message || "Failed to load statistics";

      setStatisticsError(message);
      showToast(message, "error");

    } finally {

      setStatisticsLoading(false);

    }

  }, [showToast]);


  // Refresh Todos and Statistics
  const refreshTodosAndStatistics = async () => {

    await Promise.all([
      loadTodos(),
      loadStatistics()
    ]);

  };


  // Load Initial Dashboard Data
  useEffect(() => {

    loadCategories();
    loadStatistics();

  }, [loadCategories, loadStatistics]);


  // Search and Filter Todos
  useEffect(() => {

    const timer = setTimeout(loadTodos, 300);

    return () => clearTimeout(timer);

  }, [loadTodos]);


  // Refresh Entire Dashboard
  const refreshAll = useCallback(async () => {

    if (refreshing) return;

    try {

      setRefreshing(true);

      await Promise.all([
        loadTodos(),
        loadCategories(),
        loadStatistics()
      ]);

      showToast("Dashboard refreshed!", "success");

    } catch (error) {

      console.error("Failed to refresh dashboard:", error);

    } finally {

      setRefreshing(false);

    }

  }, [
    refreshing,
    loadTodos,
    loadCategories,
    loadStatistics,
    showToast
  ]);


  // Open Create Todo Form
  const openCreateForm = () => {

    resetForm();
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  };


  // Edit Todo
  const handleEdit = (todo) => {

    setEditingTodoId(todo._id);

    setFormData({
      title: todo.title || "",
      description: todo.description || "",
      dueDate: formatDateForInput(todo.dueDate),
      priority: todo.priority || "medium",
      category: todo.category?._id || todo.category || ""
    });

    setFormError("");
    resetCategoryForm();
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  };


  // Close Todo Form
  const closeForm = () => {

    if (formLoading) return;

    setShowForm(false);
    resetForm();

  };


  // Create or Update Todo
  const handleSubmit = async (event) => {

    event.preventDefault();
    setFormError("");

    if (!formData.title.trim()) {

      setFormError("Title is required.");
      showToast("Title is required.", "error");
      return;

    }

    try {

      setFormLoading(true);

      const token = getToken();

      if (!token) {
        setFormError("You are not logged in.");
        showToast("You are not logged in.", "error");
        return;
      }

      const todoData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        dueDate: formData.dueDate || null,
        priority: formData.priority,
        category: formData.category || null
      };

      if (editingTodoId) {
        await updateTodo(editingTodoId, todoData, token);
      } else {
        await createTodo(todoData, token);
      }

      showToast(
        editingTodoId
          ? "Todo updated successfully!"
          : "Todo created successfully!"
      );

      setShowForm(false);
      resetForm();

      await refreshTodosAndStatistics();

    } catch (error) {

      console.error(
        "Failed to save todo:",
        error.response?.data || error.message
      );

      const message =
        error.response?.data?.message || "Failed to save todo";

      setFormError(message);
      showToast(message, "error");

    } finally {

      setFormLoading(false);

    }

  };


  // Toggle Todo Status
  const handleToggle = async (todoId) => {

    try {

      const token = getToken();

      if (!token) {
        showToast("You are not logged in.", "error");
        return;
      }

      await toggleTodo(todoId, token);

      showToast("Todo status updated!", "success");

      await refreshTodosAndStatistics();

    } catch (error) {

      console.error(
        "Failed to toggle todo:",
        error.response?.data || error.message
      );

      showToast(
        error.response?.data?.message || "Failed to update todo.",
        "error"
      );

    }

  };


  // Cancel Todo Deletion
  const cancelDelete = () => {

    if (deleteLoading) return;

    setDeleteTodoId(null);

  };


  // Confirm Todo Deletion
  const confirmDelete = async () => {

    if (!deleteTodoId) return;

    try {

      setDeleteLoading(true);

      const token = getToken();

      if (!token) {
        showToast("You are not logged in.", "error");
        return;
      }

      await deleteTodo(deleteTodoId, token);

      showToast("Todo deleted successfully!", "success");
      setDeleteTodoId(null);

      await refreshTodosAndStatistics();

    } catch (error) {

      console.error(
        "Failed to delete todo:",
        error.response?.data || error.message
      );

      showToast(
        error.response?.data?.message || "Failed to delete todo.",
        "error"
      );

    } finally {

      setDeleteLoading(false);

    }

  };


  // Create Category
  const handleCreateCategory = async () => {

    setCategoryError("");

    const trimmedName = categoryName.trim();

    if (!trimmedName) {
      setCategoryError("Category name is required");
      showToast("Category name is required", "error");
      return;
    }

    try {

      setCategoryCreating(true);

      const token = getToken();

      if (!token) {
        setCategoryError("You are not logged in");
        showToast("You are not logged in", "error");
        return;
      }

      const data = await createCategory(
        {
          name: trimmedName,
          color: categoryColor
        },
        token
      );

      const createdCategory = data?.category || data;

      await loadCategories();

      if (createdCategory?._id) {
        setFormData(previous => ({
          ...previous,
          category: createdCategory._id
        }));
      }

      showToast("Category created successfully!", "success");

      resetCategoryForm();

    } catch (error) {

      console.error(
        "Failed to create category:",
        error.response?.data || error.message
      );

      const message =
        error.response?.data?.message || "Failed to create category";

      setCategoryError(message);
      showToast(message, "error");

    } finally {

      setCategoryCreating(false);

    }

  };


  // Edit Category
  const handleEditCategory = (category) => {

    resetCategoryForm();

    setEditingCategoryId(category._id);
    setCategoryName(category.name);
    setCategoryColor(category.color || "#6366f1");
    setShowCategoryForm(true);

  };


  // Update Category
  const handleUpdateCategory = async () => {

    const trimmedName = categoryName.trim();

    if (!trimmedName) {
      setCategoryError("Category name is required");
      return;
    }

    try {

      setCategoryCreating(true);

      const token = getToken();

      if (!token) {
        setCategoryError("You are not logged in.");
        showToast("You are not logged in.", "error");
        return;
      }

      await updateCategory(
        editingCategoryId,
        {
          name: trimmedName,
          color: categoryColor
        },
        token
      );

      await loadCategories();

      resetCategoryForm();

      showToast("Category updated successfully!");

    } catch (error) {

      const message =
        error.response?.data?.message || "Failed to update category";

      setCategoryError(message);
      showToast(message, "error");

    } finally {

      setCategoryCreating(false);

    }

  };


  // Delete Category

  const handleDeleteCategory = async (categoryId) => {

    if (!window.confirm("Are you sure you want to delete this category?")) {
      return;
    }

    try {
      setCategoryDeleting(true);

      const token = getToken();

      if (!token) {
        showToast("You are not logged in.", "error");
        return;
      }

      await deleteCategory(categoryId, token);

      if (selectedCategory === categoryId) {
        setSelectedCategory("all");
      }

      if (formData.category === categoryId) {
        setFormData(previous => ({
          ...previous,
          category: ""
        }));
      }

      showToast("Category deleted successfully!", "success");

      await loadCategories();

    } catch (error) {
      showToast(
        error.response?.data?.message || "Failed to delete category.",
        "error"
      );
    } finally {
      setCategoryDeleting(false);
    }
  };

  // Clear All Filters
  const clearFilters = () => {

    setSearch("");
    setStatus("all");
    setSelectedCategory("all");
    setDueDateFilter("all");

  };


  // Logout
  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    window.location.href = "/";

  };

 
  // Dashboard Layout
  return (

    <div className="min-h-screen bg-gray-50">

      <Toast
        toast={toast}
        setToast={setToast}
      />

      <DeleteConfirmation
        deleteTodoId={deleteTodoId}
        deleteLoading={deleteLoading}
        cancelDelete={cancelDelete}
        confirmDelete={confirmDelete}
      />

      <DashboardHeader
        user={user}
        refreshAll={refreshAll}
        refreshing={refreshing}
        handleLogout={handleLogout}
      />

      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[220px_minmax(0,1fr)_280px] min-h-[calc(100vh-80px)]">

        {/* LEFT SIDEBAR */}
        <aside className="bg-white border-r border-gray-200 p-5">

          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Workspace
          </h3>

          <button
            onClick={() => setSelectedCategory("all")}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium ${
              selectedCategory === "all"
                ? "bg-blue-50 text-blue-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <span>☰</span>
            All Tasks
          </button>

          <div className="mt-8">

            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Categories
              </h3>
              <span className="text-xs text-gray-400">
                {categories.length}
              </span>
            </div>

            {categoryLoading ? (

              <p className="text-sm text-gray-400 px-3">
                Loading categories...
              </p>

            ) : categories.length === 0 ? (

              <p className="text-sm text-gray-400 px-3">
                No categories yet
              </p>

            ) : (

              <div className="space-y-1">

                {categories.map((category) => (

                  <button
                    key={category._id}
                    onClick={() => setSelectedCategory(category._id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left ${
                      selectedCategory === category._id
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >

                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{
                        backgroundColor: category.color || "#6366f1"
                      }}
                    />

                    <span className="truncate">
                      {category.name}
                    </span>

                  </button>

                ))}

              </div>

            )}

          </div>

          <div className="mt-8 border-t border-gray-100 pt-5">

            <p className="text-xs text-gray-400 leading-relaxed">
              Organize your tasks using categories and filters.
            </p>

          </div>

        </aside>


        {/* CENTER CONTENT */}
        <main className="min-w-0 p-4 sm:p-6 lg:p-8">

          <DashboardPageHeader
            user={user}
            openCreateForm={openCreateForm}
          />

          <TodoForm
            showForm={showForm}
            editingTodoId={editingTodoId}
            formData={formData}
            formLoading={formLoading}
            formError={formError}
            categories={categories}
            categoryLoading={categoryLoading}
            showCategoryForm={showCategoryForm}
            categoryName={categoryName}
            categoryColor={categoryColor}
            categoryError={categoryError}
            categoryCreating={categoryCreating}
            setFormData={setFormData}
            setShowCategoryForm={setShowCategoryForm}
            setCategoryName={setCategoryName}
            setCategoryColor={setCategoryColor}
            setCategoryError={setCategoryError}
            handleSubmit={handleSubmit}
            handleCreateCategory={handleCreateCategory}
            editingCategoryId={editingCategoryId}
            categoryDeleting={categoryDeleting}
            handleEditCategory={handleEditCategory}
            handleUpdateCategory={handleUpdateCategory}
            handleDeleteCategory={handleDeleteCategory}
            handleCancelCategory={resetCategoryForm}
            closeForm={closeForm}
          />

          <TodoFilters
            search={search}
            setSearch={setSearch}
            status={status}
            setStatus={setStatus}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            dueDateFilter={dueDateFilter}
            setDueDateFilter={setDueDateFilter}
            categories={categories}
            categoryLoading={categoryLoading}
            hasActiveFilters={hasActiveFilters}
            clearFilters={clearFilters}
          />

          <TodoListSection
            todoError={todoError}
            todoLoading={todoLoading}
            todos={todos}
            hasActiveFilters={hasActiveFilters}
            clearFilters={clearFilters}
            handleToggle={handleToggle}
            handleEdit={handleEdit}
            handleDelete={setDeleteTodoId}
          />

        </main>


        {/* RIGHT SIDEBAR */}
        <aside className="bg-white border-l border-gray-200 p-5">

          <StatisticsPanel
            statistics={statistics}
            statisticsLoading={statisticsLoading}
            statisticsError={statisticsError}
            showStatistics={showStatistics}
            setShowStatistics={setShowStatistics}
            dueDateFilter={dueDateFilter}
            setDueDateFilter={setDueDateFilter}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />

        </aside>

      </div>

    </div>

  );


}

export default Dashboard;
