import {
  useCallback,
  useEffect,
  useState
} from "react";

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

import {
  formatDateForInput
} from "../utils/dateUtils";

import StatisticsPanel from "../components/dashboard/StatisticsPanel";
import TodoForm from "../components/dashboard/TodoForm";
import TodoFilters from "../components/dashboard/TodoFilters";
import Toast from "../components/dashboard/Toast";
import DeleteConfirmation from "../components/dashboard/DeleteConfirmation";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardPageHeader from "../components/dashboard/DashboardPageHeader";
import TodoListSection from "../components/dashboard/TodoListSection";

const EMPTY_FORM = {
  title: "",
  description: "",
  dueDate: "",
  priority: "medium",
  category: ""
};

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

const getToken = () => localStorage.getItem("token");

function Dashboard() {

  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [showForm, setShowForm] = useState(false);
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const [todos, setTodos] = useState([]);
  const [todoLoading, setTodoLoading] = useState(true);
  const [todoError, setTodoError] = useState("");

  const [categories, setCategories] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(true);

  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categoryColor, setCategoryColor] = useState("#6366f1");
  const [categoryError, setCategoryError] = useState("");
  const [categoryCreating, setCategoryCreating] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [categoryDeleting, setCategoryDeleting] = useState(false);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [dueDateFilter, setDueDateFilter] = useState("all");

  const [statistics, setStatistics] = useState(EMPTY_STATISTICS);
  const [statisticsLoading, setStatisticsLoading] = useState(true);
  const [statisticsError, setStatisticsError] = useState("");
  const [showStatistics, setShowStatistics] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: ""
  });

  const [deleteTodoId, setDeleteTodoId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const hasActiveFilters =
    search.trim() !== "" ||
    status !== "all" ||
    selectedCategory !== "all" ||
    dueDateFilter !== "all";

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

  const resetForm = () => {

    setFormData({ ...EMPTY_FORM });
    setEditingTodoId(null);
    setFormError("");
    setShowCategoryForm(false);
    setCategoryName("");
    setCategoryColor("#6366f1");
    setCategoryError("");

  };

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
        total: data?.total || 0,
        active: data?.active || 0,
        completed: data?.completed || 0,
        overdue: data?.overdue || 0,
        dueToday: data?.dueToday || 0,
        dueTomorrow: data?.dueTomorrow || 0,
        upcoming: data?.upcoming || 0,
        noDueDate: data?.noDueDate || 0,
        completionPercentage: data?.completionPercentage || 0,

        priority: {
          high: data?.priority?.high || 0,
          medium: data?.priority?.medium || 0,
          low: data?.priority?.low || 0
        },

        categories: Array.isArray(data?.categories)
          ? data.categories
          : []
      });

    } catch (error) {

      console.error(
        "Failed to load statistics:",
        error.response?.data || error.message
      );

      const message =
        error.response?.data?.message || "Failed to load statistics";

      setStatisticsError(message);
      showToast(message, "error");

    } finally {

      setStatisticsLoading(false);

    }

  }, [showToast]);

  useEffect(() => {

    loadCategories();
    loadStatistics();

  }, [loadCategories, loadStatistics]);

  useEffect(() => {

    const timer = setTimeout(loadTodos, 300);

    return () => clearTimeout(timer);

  }, [loadTodos]);

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

  const openCreateForm = () => {

    resetForm();
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  };

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
    setShowCategoryForm(false);
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  };

  const closeForm = () => {

    if (formLoading) return;

    setShowForm(false);
    resetForm();

  };

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
        showToast("Todo updated successfully!", "success");

      } else {

        await createTodo(todoData, token);
        showToast("Todo created successfully!", "success");

      }

      setShowForm(false);
      resetForm();

      await Promise.all([
        loadTodos(),
        loadStatistics()
      ]);

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

  const handleToggle = async (todoId) => {

    try {

      const token = getToken();

      if (!token) {
        showToast("You are not logged in.", "error");
        return;
      }

      await toggleTodo(todoId, token);

      showToast("Todo status updated!", "success");

      await Promise.all([
        loadTodos(),
        loadStatistics()
      ]);

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

  const handleDelete = (todoId) => {
    setDeleteTodoId(todoId);
  };

  const cancelDelete = () => {

    if (deleteLoading) return;

    setDeleteTodoId(null);

  };

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

      await Promise.all([
        loadTodos(),
        loadStatistics()
      ]);

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

      setCategoryName("");
      setCategoryColor("#6366f1");
      setCategoryError("");
      setShowCategoryForm(false);

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

  const handleEditCategory = (category) => {
    setEditingCategoryId(category._id);
    setCategoryName(category.name);
    setCategoryColor(category.color || "#6366f1");
    setCategoryError("");
    setShowCategoryForm(true);
  };

  const handleUpdateCategory = async () => {
  if (!categoryName.trim()) {
    setCategoryError("Category name is required");
    return;
  }

  try {
    setCategoryCreating(true);

    const token = getToken();

    await updateCategory(
      editingCategoryId,
      {
        name: categoryName.trim(),
        color: categoryColor
      },
      token
    );

    await loadCategories();

    setEditingCategoryId(null);
    setCategoryName("");
    setCategoryColor("#6366f1");
    setShowCategoryForm(false);

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

      await loadCategories();

      if (selectedCategory === categoryId) {
        setSelectedCategory("all");
      }

      if (formData.category === categoryId) {
        setFormData(previous => ({
          ...previous,
          category: ""
        }));
      }

      showToast("Category deleted successfully!");

    } catch (error) {
      showToast(
        error.response?.data?.message || "Failed to delete category.",
        "error"
      );
    } finally {
      setCategoryDeleting(false);
    }
  };

  const clearFilters = () => {

    setSearch("");
    setStatus("all");
    setSelectedCategory("all");
    setDueDateFilter("all");

  };

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    window.location.href = "/";

  };

  return (

    <div className="min-h-screen bg-gray-100">

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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

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
          handleDelete={handleDelete}
        />

      </main>

    </div>

  );

}

export default Dashboard;