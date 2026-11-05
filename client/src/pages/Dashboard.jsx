import {
  useCallback,
  useEffect,
  useMemo,
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
  createCategory
} from "../services/categoryService";

import {
  getStatistics
} from "../services/statisticsService";

import {
  formatDateForInput,
} from "../utils/dateUtils";


import StatisticsPanel from "../components/dashboard/StatisticsPanel";
import TodoForm from "../components/dashboard/TodoForm";
import TodoFilters from "../components/dashboard/TodoFilters";
import TodoCard from "../components/dashboard/TodoCard";
import Toast from "../components/dashboard/Toast";
import DeleteConfirmation from "../components/dashboard/DeleteConfirmation";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardPageHeader from "../components/dashboard/DashboardPageHeader";

// =========================================================
// CONSTANTS
// =========================================================

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

// =========================================================
// HELPER FUNCTIONS
// =========================================================

const getToken = () => {
  return localStorage.getItem("token");
};

// =========================================================
// MAIN DASHBOARD
// =========================================================

function Dashboard() {

  // =======================================================
  // USER
  // =======================================================

  const [user, setUser] =
    useState(null);


  // =======================================================
  // FORM
  // =======================================================

  const [formData, setFormData] =
    useState(EMPTY_FORM);

  const [showForm, setShowForm] =
    useState(false);

  const [editingTodoId, setEditingTodoId] =
    useState(null);

  const [formLoading, setFormLoading] =
    useState(false);

  const [formError, setFormError] =
    useState("");


  // =======================================================
  // TODOS
  // =======================================================

  const [todos, setTodos] =
    useState([]);

  const [todoLoading, setTodoLoading] =
    useState(true);

  const [todoError, setTodoError] =
    useState("");


  // =======================================================
  // CATEGORIES
  // =======================================================

  const [categories, setCategories] =
    useState([]);

  const [categoryLoading, setCategoryLoading] =
    useState(true);


  // =======================================================
  // CUSTOM CATEGORY
  // =======================================================

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


  // =======================================================
  // FILTERS
  // =======================================================

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("all");

  const [selectedCategory, setSelectedCategory] =
    useState("all");

  const [dueDateFilter, setDueDateFilter] =
    useState("all");


  // =======================================================
  // STATISTICS
  // =======================================================

  const [statistics, setStatistics] =
    useState(EMPTY_STATISTICS);

  const [statisticsLoading, setStatisticsLoading] =
    useState(true);

  const [statisticsError, setStatisticsError] =
    useState("");

  const [showStatistics, setShowStatistics] =
    useState(true);


  // =======================================================
  // REFRESH
  // =======================================================

  const [refreshing, setRefreshing] =
    useState(false);

  // =======================================================
  // TOAST
  // =======================================================

  const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: ""
  });


  // =======================================================
  // DELETE CONFIRMATION
  // =======================================================

  const [deleteTodoId, setDeleteTodoId] =
    useState(null);

  const [deleteLoading, setDeleteLoading] =
    useState(false);


  // =======================================================
  // SHOW TOAST
  // =======================================================

  const showToast =
    useCallback(
      (message, type = "success") => {

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

      },
      []
    );


  // =======================================================
  // LOAD USER
  // =======================================================

  useEffect(() => {

    const token = getToken();

    const storedUser =
      localStorage.getItem("user");


    if (!token) {

      window.location.href = "/";

      return;
    }


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


  // =======================================================
  // LOAD CATEGORIES
  // =======================================================

  const loadCategories =
    useCallback(async () => {

      try {

        setCategoryLoading(true);

        const token =
          getToken();


        if (!token) {
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

    }, []);


  // =======================================================
  // LOAD TODOS
  // =======================================================

  const loadTodos =
    useCallback(async () => {

      try {

        setTodoLoading(true);
        setTodoError("");


        const token =
          getToken();


        if (!token) {

          setTodoError(
            "You are not logged in."
          );

          setTodos([]);

          return;
        }


        const params = {

          search:
            search.trim(),

          status,

          category:
            selectedCategory,

          dueDate:
            dueDateFilter

        };


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


        const message =
          error.response?.data?.message ||
          "Failed to load todos";


        setTodoError(message);


        showToast(
          message,
          "error"
        );


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


  // =======================================================
  // LOAD STATISTICS
  // =======================================================

  const loadStatistics =
    useCallback(async () => {

      try {

        setStatisticsLoading(true);
        setStatisticsError("");


        const token =
          getToken();


        if (!token) {

          setStatisticsError(
            "You are not logged in."
          );

          return;
        }


        const data =
          await getStatistics(token);


        setStatistics({

          total:
            data?.total || 0,

          active:
            data?.active || 0,

          completed:
            data?.completed || 0,

          overdue:
            data?.overdue || 0,

          dueToday:
            data?.dueToday || 0,

          dueTomorrow:
            data?.dueTomorrow || 0,

          upcoming:
            data?.upcoming || 0,

          noDueDate:
            data?.noDueDate || 0,

          completionPercentage:
            data?.completionPercentage || 0,

          priority: {

            high:
              data?.priority?.high || 0,

            medium:
              data?.priority?.medium || 0,

            low:
              data?.priority?.low || 0

          },

          categories:
            Array.isArray(
              data?.categories
            )
              ? data.categories
              : []

        });

      } catch (error) {

        console.error(
          "Failed to load statistics:",
          error.response?.data ||
          error.message
        );


        const message =
          error.response?.data?.message ||
          "Failed to load statistics";


        setStatisticsError(message);


        showToast(
          message,
          "error"
        );

      } finally {

        setStatisticsLoading(false);

      }

    }, [
      showToast
    ]);


  // =======================================================
  // INITIAL LOAD
  // =======================================================

  useEffect(() => {

    loadCategories();
    loadStatistics();

  }, [
    loadCategories,
    loadStatistics
  ]);


  // =======================================================
  // FILTER-BASED TODO LOAD
  // =======================================================

  useEffect(() => {

    const timer =
      setTimeout(() => {

        loadTodos();

      }, 300);


    return () =>
      clearTimeout(timer);

  }, [loadTodos]);


  // =======================================================
  // REFRESH ALL DATA
  // =======================================================

  const refreshAll =
    useCallback(async () => {

      if (refreshing) {
        return;
      }


      try {

        setRefreshing(true);

        await Promise.all([
          loadTodos(),
          loadCategories(),
          loadStatistics()
        ]);


        showToast(
          "Dashboard refreshed!",
          "success"
        );

      } catch (error) {

        console.error(
          "Failed to refresh dashboard:",
          error
        );

      } finally {

        setRefreshing(false);

      }

    }, [
      loadTodos,
      loadCategories,
      loadStatistics,
      refreshing,
      showToast
    ]);


  // =======================================================
  // OPEN CREATE FORM
  // =======================================================

  const openCreateForm = () => {

    setEditingTodoId(null);

    setFormData({
      ...EMPTY_FORM
    });

    setFormError("");

    setShowCategoryForm(false);

    setCategoryName("");

    setCategoryColor("#6366f1");

    setCategoryError("");

    setShowForm(true);


    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  };


  // =======================================================
  // OPEN EDIT FORM
  // =======================================================

  const handleEdit = (todo) => {

    setEditingTodoId(
      todo._id
    );


    setFormData({

      title:
        todo.title || "",

      description:
        todo.description || "",

      dueDate:
        formatDateForInput(
          todo.dueDate
        ),

      priority:
        todo.priority || "medium",

      category:
        todo.category?._id ||
        todo.category ||
        ""

    });


    setFormError("");

    setShowCategoryForm(false);

    setCategoryName("");

    setCategoryColor("#6366f1");

    setCategoryError("");

    setShowForm(true);


    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  };


  // =======================================================
  // CLOSE FORM
  // =======================================================

  const closeForm = () => {

    if (formLoading) {
      return;
    }


    setShowForm(false);

    setEditingTodoId(null);

    setFormData({
      ...EMPTY_FORM
    });

    setFormError("");

    setShowCategoryForm(false);

    setCategoryName("");

    setCategoryColor("#6366f1");

    setCategoryError("");

  };


  // =======================================================
  // CREATE / UPDATE TODO
  // =======================================================

  const handleSubmit =
    async (event) => {

      event.preventDefault();

      setFormError("");


      if (!formData.title.trim()) {

        setFormError(
          "Title is required."
        );

        showToast(
          "Title is required.",
          "error"
        );

        return;
      }


      try {

        setFormLoading(true);


        const token =
          getToken();


        if (!token) {

          setFormError(
            "You are not logged in."
          );

          showToast(
            "You are not logged in.",
            "error"
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


        if (editingTodoId) {

          await updateTodo(
            editingTodoId,
            todoData,
            token
          );


          showToast(
            "Todo updated successfully!",
            "success"
          );

        } else {

          await createTodo(
            todoData,
            token
          );


          showToast(
            "Todo created successfully!",
            "success"
          );

        }


        closeForm();


        await Promise.all([
          loadTodos(),
          loadStatistics()
        ]);

      } catch (error) {

        console.error(
          "Failed to save todo:",
          error.response?.data ||
          error.message
        );


        const message =
          error.response?.data?.message ||
          "Failed to save todo";


        setFormError(message);


        showToast(
          message,
          "error"
        );

      } finally {

        setFormLoading(false);

      }

    };


  // =======================================================
  // TOGGLE TODO
  // =======================================================

  const handleToggle =
    async (todoId) => {

      try {

        const token =
          getToken();


        if (!token) {

          showToast(
            "You are not logged in.",
            "error"
          );

          return;
        }


        await toggleTodo(
          todoId,
          token
        );


        showToast(
          "Todo status updated!",
          "success"
        );


        await Promise.all([
          loadTodos(),
          loadStatistics()
        ]);

      } catch (error) {

        console.error(
          "Failed to toggle todo:",
          error.response?.data ||
          error.message
        );


        showToast(
          error.response?.data?.message ||
          "Failed to update todo.",
          "error"
        );

      }

    };


  // =======================================================
  // OPEN DELETE CONFIRMATION
  // =======================================================

  const handleDelete = (todoId) => {

    setDeleteTodoId(todoId);

  };


  // =======================================================
  // CANCEL DELETE
  // =======================================================

  const cancelDelete = () => {

    if (deleteLoading) {
      return;
    }


    setDeleteTodoId(null);

  };


  // =======================================================
  // CONFIRM DELETE
  // =======================================================

  const confirmDelete =
    async () => {

      if (!deleteTodoId) {
        return;
      }


      try {

        setDeleteLoading(true);


        const token =
          getToken();


        if (!token) {

          showToast(
            "You are not logged in.",
            "error"
          );

          return;
        }


        await deleteTodo(
          deleteTodoId,
          token
        );


        showToast(
          "Todo deleted successfully!",
          "success"
        );


        setDeleteTodoId(null);


        await Promise.all([
          loadTodos(),
          loadStatistics()
        ]);

      } catch (error) {

        console.error(
          "Failed to delete todo:",
          error.response?.data ||
          error.message
        );


        showToast(
          error.response?.data?.message ||
          "Failed to delete todo.",
          "error"
        );

      } finally {

        setDeleteLoading(false);

      }

    };


  // =======================================================
  // CREATE CATEGORY
  // =======================================================

  const handleCreateCategory =
    async () => {

      setCategoryError("");


      const trimmedName =
        categoryName.trim();


      if (!trimmedName) {

        setCategoryError(
          "Category name is required"
        );


        showToast(
          "Category name is required",
          "error"
        );

        return;
      }


      try {

        setCategoryCreating(true);


        const token =
          getToken();


        if (!token) {

          setCategoryError(
            "You are not logged in"
          );


          showToast(
            "You are not logged in",
            "error"
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

          setFormData(
            (previous) => ({
              ...previous,
              category:
                createdCategory._id
            })
          );

        }


        showToast(
          "Category created successfully!",
          "success"
        );


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


        const message =
          error.response?.data?.message ||
          "Failed to create category";


        setCategoryError(message);


        showToast(
          message,
          "error"
        );

      } finally {

        setCategoryCreating(false);

      }

    };


  // =======================================================
  // CLEAR FILTERS
  // =======================================================

  const clearFilters = () => {

    setSearch("");

    setStatus("all");

    setSelectedCategory("all");

    setDueDateFilter("all");

  };


  // =======================================================
  // ACTIVE FILTERS
  // =======================================================

  const hasActiveFilters =
    useMemo(() => {

      return (
        search.trim() !== "" ||
        status !== "all" ||
        selectedCategory !== "all" ||
        dueDateFilter !== "all"
      );

    }, [
      search,
      status,
      selectedCategory,
      dueDateFilter
    ]);


  // =======================================================
  // LOGOUT
  // =======================================================

  const handleLogout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    setUser(null);

    window.location.href = "/";

  };


  // =======================================================
  // RENDER
  // =======================================================

  return (

    <div className="min-h-screen bg-gray-100">


      <Toast
        toast={toast}
        setToast={setToast}
      />


      {/* ===================================================
          DELETE CONFIRMATION MODAL
      =================================================== */}

      <DeleteConfirmation
        deleteTodoId={deleteTodoId}
        deleteLoading={deleteLoading}
        cancelDelete={cancelDelete}
        confirmDelete={confirmDelete}
      />

      {/* ===================================================
          HEADER
      =================================================== */}

      <DashboardHeader
        user={user}
        refreshAll={refreshAll}
        refreshing={refreshing}
        handleLogout={handleLogout}
      />
      {/* ===================================================
          MAIN
      =================================================== */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Welcome */}

        <div className="mb-6">

          <h2 className="text-2xl font-bold text-gray-900">
            Hello,{" "}
            <span className="text-indigo-600">
              {user?.name || "User"}
            </span>
            {" "}👋
          </h2>

          <p className="text-gray-500 mt-1">
            Organize and manage your todos
          </p>

        </div>


        {/* Statistics */}

        <StatisticsPanel

          statistics={statistics}

          statisticsLoading={
            statisticsLoading
          }

          statisticsError={
            statisticsError
          }

          showStatistics={
            showStatistics
          }

          setShowStatistics={
            setShowStatistics
          }

          dueDateFilter={
            dueDateFilter
          }

          setDueDateFilter={
            setDueDateFilter
          }

          selectedCategory={
            selectedCategory
          }

          setSelectedCategory={
            setSelectedCategory
          }

        />


        {/* Page Header */}

        <DashboardPageHeader
          user={user}
          openCreateForm={openCreateForm}
        />

        {/* Todo Form */}

        <TodoForm

          showForm={showForm}

          editingTodoId={
            editingTodoId
          }

          formData={formData}

          formLoading={
            formLoading
          }

          formError={
            formError
          }

          categories={
            categories
          }

          categoryLoading={
            categoryLoading
          }

          showCategoryForm={
            showCategoryForm
          }

          categoryName={
            categoryName
          }

          categoryColor={
            categoryColor
          }

          categoryError={
            categoryError
          }

          categoryCreating={
            categoryCreating
          }

          setFormData={
            setFormData
          }

          setShowCategoryForm={
            setShowCategoryForm
          }

          setCategoryName={
            setCategoryName
          }

          setCategoryColor={
            setCategoryColor
          }

          setCategoryError={
            setCategoryError
          }

          handleSubmit={
            handleSubmit
          }

          handleCreateCategory={
            handleCreateCategory
          }

          closeForm={
            closeForm
          }

        />


        {/* Filters */}

        <TodoFilters

          search={search}

          setSearch={setSearch}

          status={status}

          setStatus={setStatus}

          selectedCategory={
            selectedCategory
          }

          setSelectedCategory={
            setSelectedCategory
          }

          dueDateFilter={
            dueDateFilter
          }

          setDueDateFilter={
            setDueDateFilter
          }

          categories={
            categories
          }

          categoryLoading={
            categoryLoading
          }

          hasActiveFilters={
            hasActiveFilters
          }

          clearFilters={
            clearFilters
          }

        />


        {/* Todo Error */}

        {todoError && (

          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
            {todoError}
          </div>

        )}


        {/* Todo Loading */}

        {todoLoading && (

          <div className="bg-white rounded-xl shadow-sm border p-8 text-center">

            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600" />

            <p className="mt-3 text-gray-500">
              Loading todos...
            </p>

          </div>

        )}


        {/* Empty */}

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


        {/* Todo List */}

        {!todoLoading &&
          todos.length > 0 && (

            <div className="space-y-4">

              {todos.map(
                (todo) => (

                  <TodoCard
                    key={todo._id}
                    todo={todo}
                    handleToggle={
                      handleToggle
                    }
                    handleEdit={
                      handleEdit
                    }
                    handleDelete={
                      handleDelete
                    }
                  />

                )
              )}

            </div>

          )}

      </main>

    </div>
  );
}


export default Dashboard;