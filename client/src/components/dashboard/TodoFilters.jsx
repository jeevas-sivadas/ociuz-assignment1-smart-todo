
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
        <div className="mb-5 space-y-3">

            {/* Search */}

            <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search tasks..."
                className="w-full rounded-md border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />

            {/* Filter Options */}

            <div className="flex flex-wrap items-center gap-2">

                <select
                    value={status}
                    onChange={(event) => setStatus(event.target.value)}
                    className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 outline-none focus:border-indigo-400"
                >
                    <option value="all">All tasks</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="overdue">Overdue</option>
                </select>

                <select
                    value={selectedCategory}
                    onChange={(event) => setSelectedCategory(event.target.value)}
                    disabled={categoryLoading}
                    className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 outline-none focus:border-indigo-400 disabled:bg-gray-100"
                >
                    <option value="all">All categories</option>

                    {!categoryLoading &&
                        categories.map((category) => (
                            <option
                                key={category._id}
                                value={category._id}
                            >
                                {category.name}
                            </option>
                        ))}
                </select>

                <select
                    value={dueDateFilter}
                    onChange={(event) => setDueDateFilter(event.target.value)}
                    className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 outline-none focus:border-indigo-400"
                >
                    <option value="all">All due dates</option>
                    <option value="today">Today</option>
                    <option value="tomorrow">Tomorrow</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="overdue">Overdue</option>
                    <option value="none">No due date</option>
                </select>

                {hasActiveFilters && (
                    <button
                        type="button"
                        onClick={clearFilters}
                        className="rounded-md px-3 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50"
                    >
                        Clear filters
                    </button>
                )}

            </div>

        </div>
    );
}

export default TodoFilters;
