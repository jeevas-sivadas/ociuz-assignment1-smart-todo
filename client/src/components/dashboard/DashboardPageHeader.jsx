function DashboardPageHeader({
  user,
  openCreateForm
}) {
  return (
    <>
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
    </>
  );
}

export default DashboardPageHeader;