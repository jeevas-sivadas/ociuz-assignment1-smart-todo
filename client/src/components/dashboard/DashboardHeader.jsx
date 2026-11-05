import { getUserInitial } from "../../utils/todoUtils";

function DashboardHeader({
  user,
  refreshAll,
  refreshing,
  handleLogout
}) {
  return (
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
                  {getUserInitial(user.name)}
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
                {getUserInitial(user.name)}
              </div>
            )}

            <button
              type="button"
              onClick={refreshAll}
              disabled={refreshing}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              title="Refresh dashboard"
            >
              {refreshing ? "↻" : "↻ Refresh"}
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
  );
}

export default DashboardHeader;