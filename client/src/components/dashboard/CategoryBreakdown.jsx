function CategoryBreakdown({
    categories,
    total,
    selectedCategory,
    setSelectedCategory
}) {
    if (categories.length === 0) {
        return null;
    }

    return (
        <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900">
                    Category Breakdown
                </h4>

                {selectedCategory !== "all" && (
                    <button
                        type="button"
                        onClick={() => setSelectedCategory("all")}
                        className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                    >
                        Clear Category
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {categories.map((category) => {
                    const categoryId = category.id || category._id;
                    const isSelected = selectedCategory === categoryId;

                    const categoryPercentage = total > 0
                        ? Math.round((category.total / total) * 100)
                        : 0;

                    return (
                        <button
                            type="button"
                            key={categoryId}
                            onClick={() =>
                                setSelectedCategory(
                                    isSelected ? "all" : categoryId
                                )
                            }
                            className={`rounded-xl border p-4 text-left transition ${
                                isSelected
                                    ? "border-indigo-500 bg-indigo-50"
                                    : "hover:bg-gray-50"
                            }`}
                        >
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2 min-w-0">
                                    <span
                                        className="h-3 w-3 rounded-full flex-shrink-0"
                                        style={{
                                            backgroundColor: category.color || "#6366f1"
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
                                        backgroundColor: category.color || "#6366f1",
                                        width: `${categoryPercentage}%`
                                    }}
                                />
                            </div>

                            <div className="flex justify-between mt-2 text-xs text-gray-500">
                                <span>{category.completed} completed</span>
                                <span>{category.active} active</span>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default CategoryBreakdown;