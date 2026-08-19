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


const formatDateForInput = (dateValue) => {
  if (!dateValue) {
    return "";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};


const formatDate = (dateValue) => {
  if (!dateValue) {
    return "No due date";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
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


const getPriorityClass = (priority) => {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-700";

    case "low":
      return "bg-green-100 text-green-700";

    default:
      return "bg-yellow-100 text-yellow-700";
  }
};


const getUserInitial = (user) => {
  if (!user?.name) {
    return "U";
  }

  return user.name
    .charAt(0)
    .toUpperCase();
};


// =========================================================
// STATISTICS PANEL
// =========================================================

function StatisticsPanel({
  statistics,
  statisticsLoading,
  statisticsError,
  showStatistics,
  setShowStatistics,
  dueDateFilter,
  setDueDateFilter,
  selectedCategory,
  setSelectedCategory
}) {

  const highPercentage =
    statistics.total > 0
      ? Math.round(
        (statistics.priority.high /
          statistics.total) *
        100
      )
      : 0;


  const mediumPercentage =
    statistics.total > 0
      ? Math.round(
        (statistics.priority.medium /
          statistics.total) *
        100
      )
      : 0;


  const lowPercentage =
    statistics.total > 0
      ? Math.round(
        (statistics.priority.low /
          statistics.total) *
        100
      )
      : 0;


  return (
    <div className="bg-white rounded-xl shadow-sm border mb-6 overflow-hidden">

      {/* Header */}

      <div className="flex items-center justify-between px-6 py-5 border-b">

        <div>
          <h3 className="text-lg font-bold text-gray-900">
            Task Statistics
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            Overview of all your tasks
          </p>
        </div>


        <button
          type="button"
          onClick={() =>
            setShowStatistics(
              (previous) => !previous
            )
          }
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          {showStatistics ? "Hide" : "Show"}
        </button>

      </div>


      {showStatistics && (

        <div className="p-6">

          {/* Error */}

          {statisticsError && (
            <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
              {statisticsError}
            </div>
          )}


          {/* Loading */}

          {statisticsLoading ? (

            <div className="py-10 text-center">

              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600" />

              <p className="mt-3 text-gray-500">
                Loading statistics...
              </p>

            </div>

          ) : (

            <>

              {/* Main statistics */}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                {/* Total */}

                <div className="rounded-xl border bg-indigo-50 border-indigo-100 p-5">

                  <div className="flex items-center justify-between">

                    <div>
                      <p className="text-sm font-medium text-indigo-600">
                        Total Tasks
                      </p>

                      <p className="text-3xl font-bold text-indigo-900 mt-2">
                        {statistics.total}
                      </p>
                    </div>

                    <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-2xl">
                      📋
                    </div>

                  </div>

                </div>


                {/* Completed */}

                <div className="rounded-xl border bg-green-50 border-green-100 p-5">

                  <div className="flex items-center justify-between">

                    <div>
                      <p className="text-sm font-medium text-green-600">
                        Completed
                      </p>

                      <p className="text-3xl font-bold text-green-900 mt-2">
                        {statistics.completed}
                      </p>
                    </div>

                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-2xl">
                      ✓
                    </div>

                  </div>

                </div>


                {/* Active */}

                <div className="rounded-xl border bg-yellow-50 border-yellow-100 p-5">

                  <div className="flex items-center justify-between">

                    <div>
                      <p className="text-sm font-medium text-yellow-600">
                        Active
                      </p>

                      <p className="text-3xl font-bold text-yellow-900 mt-2">
                        {statistics.active}
                      </p>
                    </div>

                    <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center text-2xl">
                      ⏳
                    </div>

                  </div>

                </div>


                {/* Overdue */}

                <div className="rounded-xl border bg-red-50 border-red-100 p-5">

                  <div className="flex items-center justify-between">

                    <div>
                      <p className="text-sm font-medium text-red-600">
                        Overdue
                      </p>

                      <p className="text-3xl font-bold text-red-900 mt-2">
                        {statistics.overdue}
                      </p>
                    </div>

                    <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center text-2xl">
                      ⚠️
                    </div>

                  </div>

                </div>

              </div>


              {/* Due Date Overview */}

              <div className="mt-6">

                <h4 className="font-semibold text-gray-900 mb-4">
                  Due Date Overview
                </h4>


                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">

                  <button
                    type="button"
                    onClick={() =>
                      setDueDateFilter(
                        dueDateFilter === "today"
                          ? "all"
                          : "today"
                      )
                    }
                    className={`rounded-xl border p-4 text-left transition ${dueDateFilter === "today"
                        ? "border-indigo-500 bg-indigo-50"
                        : "hover:bg-indigo-50"
                      }`}
                  >

                    <p className="text-sm text-gray-500">
                      Due Today
                    </p>

                    <p className="text-2xl font-bold text-indigo-600 mt-1">
                      {statistics.dueToday}
                    </p>

                  </button>


                  <button
                    type="button"
                    onClick={() =>
                      setDueDateFilter(
                        dueDateFilter === "tomorrow"
                          ? "all"
                          : "tomorrow"
                      )
                    }
                    className={`rounded-xl border p-4 text-left transition ${dueDateFilter === "tomorrow"
                        ? "border-blue-500 bg-blue-50"
                        : "hover:bg-indigo-50"
                      }`}
                  >

                    <p className="text-sm text-gray-500">
                      Tomorrow
                    </p>

                    <p className="text-2xl font-bold text-blue-600 mt-1">
                      {statistics.dueTomorrow}
                    </p>

                  </button>


                  <button
                    type="button"
                    onClick={() =>
                      setDueDateFilter(
                        dueDateFilter === "upcoming"
                          ? "all"
                          : "upcoming"
                      )
                    }
                    className={`rounded-xl border p-4 text-left transition ${dueDateFilter === "upcoming"
                        ? "border-purple-500 bg-purple-50"
                        : "hover:bg-purple-50"
                      }`}
                  >

                    <p className="text-sm text-gray-500">
                      Upcoming
                    </p>

                    <p className="text-2xl font-bold text-purple-600 mt-1">
                      {statistics.upcoming}
                    </p>

                  </button>


                  <button
                    type="button"
                    onClick={() =>
                      setDueDateFilter(
                        dueDateFilter === "none"
                          ? "all"
                          : "none"
                      )
                    }
                    className={`rounded-xl border p-4 text-left transition ${dueDateFilter === "none"
                        ? "border-gray-500 bg-gray-100"
                        : "hover:bg-gray-50"
                      }`}
                  >

                    <p className="text-sm text-gray-500">
                      No Due Date
                    </p>

                    <p className="text-2xl font-bold text-gray-700 mt-1">
                      {statistics.noDueDate}
                    </p>

                  </button>

                </div>

              </div>


              {/* Completion Progress */}

              <div className="mt-6 rounded-xl border p-5">

                <div className="flex items-center justify-between mb-3">

                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Completion Progress
                    </h4>

                    <p className="text-sm text-gray-500">
                      {statistics.completed} of{" "}
                      {statistics.total} tasks completed
                    </p>
                  </div>

                  <span className="text-lg font-bold text-indigo-600">
                    {statistics.completionPercentage}%
                  </span>

                </div>


                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">

                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                    style={{
                      width:
                        `${statistics.completionPercentage}%`
                    }}
                  />

                </div>

              </div>


              {/* Priority */}

              <div className="mt-6">

                <h4 className="font-semibold text-gray-900 mb-4">
                  Priority Breakdown
                </h4>


                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                  <PriorityCard
                    label="High Priority"
                    count={statistics.priority.high}
                    percentage={highPercentage}
                    wrapperClass="bg-red-50 border-red-100"
                    textClass="text-red-700"
                    countClass="text-red-800"
                    trackClass="bg-red-100"
                    barClass="bg-red-500"
                  />


                  <PriorityCard
                    label="Medium Priority"
                    count={statistics.priority.medium}
                    percentage={mediumPercentage}
                    wrapperClass="bg-yellow-50 border-yellow-100"
                    textClass="text-yellow-700"
                    countClass="text-yellow-800"
                    trackClass="bg-yellow-100"
                    barClass="bg-yellow-500"
                  />


                  <PriorityCard
                    label="Low Priority"
                    count={statistics.priority.low}
                    percentage={lowPercentage}
                    wrapperClass="bg-green-50 border-green-100"
                    textClass="text-green-700"
                    countClass="text-green-800"
                    trackClass="bg-green-100"
                    barClass="bg-green-500"
                  />

                </div>

              </div>


              {/* Categories */}

              {statistics.categories.length > 0 && (

                <div className="mt-6">

                  <div className="flex items-center justify-between mb-4">

                    <h4 className="font-semibold text-gray-900">
                      Category Breakdown
                    </h4>

                    {selectedCategory !== "all" && (

                      <button
                        type="button"
                        onClick={() =>
                          setSelectedCategory("all")
                        }
                        className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                      >
                        Clear Category
                      </button>

                    )}

                  </div>


                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

                    {statistics.categories.map(
                      (category) => {

                        const categoryId =
                          category.id ||
                          category._id;

                        const isSelected =
                          selectedCategory ===
                          categoryId;


                        const categoryPercentage =
                          statistics.total > 0
                            ? Math.round(
                              (
                                category.total /
                                statistics.total
                              ) * 100
                            )
                            : 0;


                        return (

                          <button
                            type="button"
                            key={categoryId}
                            onClick={() =>
                              setSelectedCategory(
                                isSelected
                                  ? "all"
                                  : categoryId
                              )
                            }
                            className={`rounded-xl border p-4 text-left transition ${isSelected
                                ? "border-indigo-500 bg-indigo-50"
                                : "hover:bg-gray-50"
                              }`}
                          >

                            <div className="flex items-center justify-between gap-3">

                              <div className="flex items-center gap-2 min-w-0">

                                <span
                                  className="h-3 w-3 rounded-full flex-shrink-0"
                                  style={{
                                    backgroundColor:
                                      category.color ||
                                      "#6366f1"
                                  }}
                                />

                                <span className="text-sm font-semibold text-gray-700 truncate">
                                  {category.name}
                                </span>

                              </div>


                              <span className="text-lg font-bold text-gray-900">
                                {category.total}
                              </span>

                            </div>


                            <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">

                              <div
                                className="h-full rounded-full"
                                style={{
                                  backgroundColor:
                                    category.color ||
                                    "#6366f1",

                                  width:
                                    `${categoryPercentage}%`
                                }}
                              />

                            </div>


                            <div className="flex justify-between mt-2 text-xs text-gray-500">

                              <span>
                                {category.completed} completed
                              </span>

                              <span>
                                {category.active} active
                              </span>

                            </div>

                          </button>

                        );
                      }
                    )}

                  </div>

                </div>

              )}

            </>

          )}

        </div>

      )}

    </div>
  );
}


// =========================================================
// PRIORITY CARD
// =========================================================

function PriorityCard({
  label,
  count,
  percentage,
  wrapperClass,
  textClass,
  countClass,
  trackClass,
  barClass
}) {

  return (
    <div
      className={`rounded-xl border p-4 ${wrapperClass}`}
    >

      <div className="flex items-center justify-between">

        <span
          className={`text-sm font-semibold ${textClass}`}
        >
          {label}
        </span>

        <span
          className={`text-xl font-bold ${countClass}`}
        >
          {count}
        </span>

      </div>


      <div
        className={`mt-3 h-2 rounded-full overflow-hidden ${trackClass}`}
      >

        <div
          className={`h-full rounded-full ${barClass}`}
          style={{
            width: `${percentage}%`
          }}
        />

      </div>


      <p className="mt-2 text-xs text-gray-500">
        {percentage}% of all tasks
      </p>

    </div>
  );
}


// =========================================================
// TODO FORM
// =========================================================

function TodoForm({
  showForm,
  editingTodoId,
  formData,
  formLoading,
  formError,
  categories,
  categoryLoading,
  showCategoryForm,
  categoryName,
  categoryColor,
  categoryError,
  categoryCreating,
  setFormData,
  setShowCategoryForm,
  setCategoryName,
  setCategoryColor,
  setCategoryError,
  handleSubmit,
  handleCreateCategory,
  closeForm
}) {

  if (!showForm) {
    return null;
  }


  const handleChange = (event) => {

    const {
      name,
      value
    } = event.target;


    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));
  };


  return (

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
          disabled={formLoading}
          className="text-gray-400 hover:text-gray-600 text-xl disabled:opacity-50"
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
                  (previous) => !previous
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

                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Name
                  </label>

                  <input
                    type="text"
                    value={categoryName}
                    onChange={(event) =>
                      setCategoryName(
                        event.target.value
                      )
                    }
                    placeholder="e.g. Fitness"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                  />

                </div>


                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Color
                  </label>

                  <div className="flex items-center gap-3">

                    <input
                      type="color"
                      value={categoryColor}
                      onChange={(event) =>
                        setCategoryColor(
                          event.target.value
                        )
                      }
                      className="h-10 w-16 cursor-pointer rounded border border-gray-300"
                    />

                    <span className="text-sm text-gray-600">
                      {categoryColor}
                    </span>

                  </div>

                </div>


                <div className="flex gap-3">

                  <button
                    type="button"
                    onClick={handleCreateCategory}
                    disabled={categoryCreating}
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


        {/* Buttons */}

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
  );
}


// =========================================================
// FILTERS
// =========================================================

function TodoFilters({
  search,
  setSearch,
  status,
  setStatus,
  selectedCategory,
  setSelectedCategory,
  dueDateFilter,
  setDueDateFilter,
  categories,
  categoryLoading,
  hasActiveFilters,
  clearFilters
}) {

  return (

    <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">

      <div className="mb-4">

        <label className="block text-sm font-medium text-gray-700 mb-2">
          Search
        </label>

        <input
          type="text"
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder="Search todos by title or description..."
          className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
        />

      </div>


      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">

        <div>

          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>

          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value)
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


        <div>

          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>

          <select
            value={selectedCategory}
            onChange={(event) =>
              setSelectedCategory(
                event.target.value
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


        <div>

          <label className="block text-sm font-medium text-gray-700 mb-2">
            Due Date
          </label>

          <select
            value={dueDateFilter}
            onChange={(event) =>
              setDueDateFilter(
                event.target.value
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
  );
}


// =========================================================
// TODO CARD
// =========================================================

function TodoCard({
  todo,
  handleToggle,
  handleEdit,
  handleDelete
}) {

  return (

    <div
      className={`bg-white rounded-xl shadow-sm border p-5 transition ${todo.completed
          ? "opacity-75"
          : ""
        } ${todo.overdue
          ? "border-red-300"
          : "border-gray-200"
        }`}
    >

      <div className="flex items-start gap-4">

        <button
          type="button"
          onClick={() =>
            handleToggle(todo._id)
          }
          className={`mt-1 h-6 w-6 flex-shrink-0 rounded-full border-2 flex items-center justify-center transition ${todo.completed
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


        <div className="flex-1 min-w-0">

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">

            <div>

              <h3
                className={`text-lg font-semibold break-words ${todo.completed
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
                  handleDelete(todo._id)
                }
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
              >
                🗑 Delete
              </button>

            </div>

          </div>


          <div className="flex flex-wrap items-center gap-2 mt-4">

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getPriorityClass(
                todo.priority
              )}`}
            >
              {todo.priority} priority
            </span>


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


            {todo.dueDate && (

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${todo.overdue
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


            {!todo.dueDate && (

              <span className="rounded-full bg-gray-100 text-gray-500 px-3 py-1 text-xs font-semibold">
                No due date
              </span>

            )}


            {todo.completed && (

              <span className="rounded-full bg-green-100 text-green-700 px-3 py-1 text-xs font-semibold">
                ✓ Completed
              </span>

            )}

          </div>

        </div>

      </div>

    </div>
  );
}


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

  const [toast, setToast] =
    useState({
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


      {/* ===================================================
          TOAST
      =================================================== */}

      {toast.show && (

        <div className="fixed top-5 right-5 z-[100] w-[calc(100%-2rem)] max-w-sm">

          <div
            className={`rounded-xl border shadow-lg px-4 py-4 flex items-start gap-3 ${toast.type === "error"
                ? "bg-red-50 border-red-200"
                : "bg-green-50 border-green-200"
              }`}
          >

            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${toast.type === "error"
                  ? "bg-red-100 text-red-600"
                  : "bg-green-100 text-green-600"
                }`}
            >

              {toast.type === "error"
                ? "!"
                : "✓"}

            </div>


            <div className="flex-1">

              <p
                className={`text-sm font-semibold ${toast.type === "error"
                    ? "text-red-800"
                    : "text-green-800"
                  }`}
              >
                {toast.type === "error"
                  ? "Error"
                  : "Success"}
              </p>


              <p
                className={`text-sm mt-1 ${toast.type === "error"
                    ? "text-red-700"
                    : "text-green-700"
                  }`}
              >
                {toast.message}
              </p>

            </div>


            <button
              type="button"
              onClick={() =>
                setToast({
                  show: false,
                  type: "success",
                  message: ""
                })
              }
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>

          </div>

        </div>

      )}


      {/* ===================================================
          DELETE CONFIRMATION MODAL
      =================================================== */}

      {deleteTodoId && (

        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">

          {/* Backdrop */}

          <div
            className="absolute inset-0 bg-black/50"
            onClick={cancelDelete}
          />


          {/* Modal */}

          <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl">

            <div className="p-6">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-2xl">
                🗑️
              </div>


              <div className="mt-5 text-center">

                <h3 className="text-xl font-bold text-gray-900">
                  Delete Todo?
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Are you sure you want to delete this todo?
                  This action cannot be undone.
                </p>

              </div>


              <div className="mt-6 flex flex-col-reverse sm:flex-row gap-3">

                <button
                  type="button"
                  onClick={cancelDelete}
                  disabled={deleteLoading}
                  className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>


                <button
                  type="button"
                  onClick={confirmDelete}
                  disabled={deleteLoading}
                  className="flex-1 rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {deleteLoading
                    ? "Deleting..."
                    : "Yes, Delete"}
                </button>

              </div>

            </div>

          </div>

        </div>

      )}


      {/* ===================================================
          HEADER
      =================================================== */}

      <header className="bg-white border-b">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="h-20 flex items-center justify-between">

            <div>

              <h1 className="text-xl font-bold text-gray-900">
                Smart Todo
              </h1>

              <p className="text-xs text-gray-500">
                Manage your tasks
              </p>

            </div>


            <div className="flex items-center gap-3">

              {user && (

                <div className="hidden sm:flex items-center gap-3">

                  <div className="h-10 w-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                    {getUserInitial(user)}
                  </div>


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


              {user && (

                <div className="sm:hidden h-10 w-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                  {getUserInitial(user)}
                </div>

              )}


              <button
                type="button"
                onClick={refreshAll}
                disabled={refreshing}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                title="Refresh dashboard"
              >
                {refreshing
                  ? "↻"
                  : "↻ Refresh"}
              </button>


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