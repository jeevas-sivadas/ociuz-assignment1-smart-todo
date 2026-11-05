import TodoCard from "./TodoCard";

function TodoListSection({
  todoError,
  todoLoading,
  todos,
  hasActiveFilters,
  clearFilters,
  handleToggle,
  handleEdit,
  handleDelete
}) {

  return (
    <>
      {todoError && (
        <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
          {todoError}
        </div>
      )}

      {todoLoading && (
        <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600" />

          <p className="mt-3 text-gray-500">
            Loading todos...
          </p>
        </div>
      )}

      {!todoLoading && todos.length === 0 && (
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

      {!todoLoading && todos.length > 0 && (
        <div className="space-y-4">
          {todos.map((todo) => (
            <TodoCard
              key={todo._id}
              todo={todo}
              handleToggle={handleToggle}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </>
  );
}

export default TodoListSection;