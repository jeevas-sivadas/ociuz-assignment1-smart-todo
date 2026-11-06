
import { getUserInitial } from "../../utils/todoUtils";

function DashboardHeader({
  user,
  refreshAll,
  refreshing,
  handleLogout
}) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">

      <div className="px-4 sm:px-6">

        <div className="h-16 flex items-center justify-between">

          {/* Logo and Application Name */}

          <div className="flex items-center gap-3">

            <div className="h-9 w-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <span className="text-xl font-bold">✓</span>
            </div>

            <div>
              <h1 className="text-lg font-bold text-gray-900">
                Smart Todo
              </h1>

              <p className="text-xs text-gray-500">
                Manage your tasks
              </p>
            </div>

          </div>

          {/* User and Actions */}

          <div className="flex items-center gap-3">

            <button
              type="button"
              onClick={refreshAll}
              disabled={refreshing}
              className="rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50"
              title="Refresh dashboard"
            >
              {refreshing ? "↻" : "↻ Refresh"}
            </button>

            {user && (
              <div className="hidden sm:flex items-center gap-2">

                <div className="h-9 w-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold">
                  {getUserInitial(user.name)}
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {user.name || "User"}
                  </p>

                  <p className="text-xs text-gray-500">
                    {user.email || ""}
                  </p>
                </div>

              </div>
            )}

            {user && (
              <div className="sm:hidden h-9 w-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold">
                {getUserInitial(user.name)}
              </div>
            )}

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
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
