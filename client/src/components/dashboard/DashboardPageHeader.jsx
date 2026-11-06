
function DashboardPageHeader({
  user,
  openCreateForm
}) {
  return (
    <div className="flex items-center justify-between gap-4 mb-5">

      {/* Page Heading */}

      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          My Tasks
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Stay organized and get things done.
        </p>

        {user?.name && (
          <p className="text-xs text-gray-400 mt-1">
            Welcome back, {user.name}
          </p>
        )}
      </div>

      {/* Add Todo Button */}

      <button
        type="button"
        onClick={openCreateForm}
        className="flex-shrink-0 rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition"
      >
        + Add Todo
      </button>

    </div>
  );
}

export default DashboardPageHeader;
