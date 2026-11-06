function DueDateOverview({
    statistics,
    dueDateFilter,
    setDueDateFilter
}) {
    const dueDateStats = [
        {
            label: "Due Today",
            value: statistics.dueToday,
            filter: "today",
            activeClass: "border-indigo-500 bg-indigo-50",
            hoverClass: "hover:bg-indigo-50",
            textClass: "text-indigo-600"
        },
        {
            label: "Tomorrow",
            value: statistics.dueTomorrow,
            filter: "tomorrow",
            activeClass: "border-blue-500 bg-blue-50",
            hoverClass: "hover:bg-blue-50",
            textClass: "text-blue-600"
        },
        {
            label: "Upcoming",
            value: statistics.upcoming,
            filter: "upcoming",
            activeClass: "border-purple-500 bg-purple-50",
            hoverClass: "hover:bg-purple-50",
            textClass: "text-purple-600"
        },
        {
            label: "No Due Date",
            value: statistics.noDueDate,
            filter: "none",
            activeClass: "border-gray-500 bg-gray-100",
            hoverClass: "hover:bg-gray-50",
            textClass: "text-gray-700"
        }
    ];

    return (
        <div className="mt-6">
            <h4 className="font-semibold text-gray-900 mb-4">
                Due Date Overview
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {dueDateStats.map((item) => (
                    <button
                        key={item.filter}
                        type="button"
                        onClick={() =>
                            setDueDateFilter(
                                dueDateFilter === item.filter
                                    ? "all"
                                    : item.filter
                            )
                        }
                        className={`rounded-xl border p-4 text-left transition ${dueDateFilter === item.filter
                                ? item.activeClass
                                : item.hoverClass
                            }`}
                    >
                        <p className="text-sm text-gray-500">
                            {item.label}
                        </p>

                        <p className={`text-2xl font-bold mt-1 ${item.textClass}`}>
                            {item.value}
                        </p>
                    </button>
                ))}
            </div>
        </div>
    );
}

export default DueDateOverview;