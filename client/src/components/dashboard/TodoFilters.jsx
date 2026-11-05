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

            {/* Search */}

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search
                </label>

                <input
                    type="text"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search todos by title or description..."
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                />
            </div>

            {/* Filter Options */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                    </label>

                    <select
                        value={status}
                        onChange={(event) => setStatus(event.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="all">All</option>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                        <option value="overdue">Overdue</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                    </label>

                    <select
                        value={selectedCategory}
                        onChange={(event) => setSelectedCategory(event.target.value)}
                        disabled={categoryLoading}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                    >
                        <option value="all">All Categories</option>

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
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Due Date
                    </label>

                    <select
                        value={dueDateFilter}
                        onChange={(event) => setDueDateFilter(event.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="all">All Due Dates</option>
                        <option value="today">Today</option>
                        <option value="tomorrow">Tomorrow</option>
                        <option value="upcoming">Upcoming</option>
                        <option value="overdue">Overdue</option>
                        <option value="none">No Due Date</option>
                    </select>
                </div>

            </div>

            {/* Filter Status and Clear Button */}

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

export default TodoFilters;