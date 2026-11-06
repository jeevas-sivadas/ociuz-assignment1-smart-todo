
import PriorityCard from "./PriorityCard";
import CompletionProgress from "./CompletionProgress";
import CategoryBreakdown from "./CategoryBreakdown";
import MainStatistics from "./MainStatistics";
import DueDateOverview from "./DueDateOverview";

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

    // Calculate Percentage
    const getPercentage = (value) =>
        statistics.total > 0
            ? Math.round((value / statistics.total) * 100)
            : 0;

    // Priority Configuration
    const priorities = [
        {
            label: "High Priority",
            count: statistics.priority.high,
            wrapperClass: "bg-red-50 border-red-100",
            textClass: "text-red-700",
            countClass: "text-red-800",
            trackClass: "bg-red-100",
            barClass: "bg-red-500"
        },
        {
            label: "Medium Priority",
            count: statistics.priority.medium,
            wrapperClass: "bg-yellow-50 border-yellow-100",
            textClass: "text-yellow-700",
            countClass: "text-yellow-800",
            trackClass: "bg-yellow-100",
            barClass: "bg-yellow-500"
        },
        {
            label: "Low Priority",
            count: statistics.priority.low,
            wrapperClass: "bg-green-50 border-green-100",
            textClass: "text-green-700",
            countClass: "text-green-800",
            trackClass: "bg-green-100",
            barClass: "bg-green-500"
        }
    ];

    return (
        <div className="mb-5 rounded-md border border-gray-200 bg-white overflow-hidden">

            {/* Statistics Panel Header */}

            <div className="flex items-center justify-between px-4 py-3">

                <div>
                    <h3 className="text-sm font-semibold text-gray-800">
                        Task Statistics
                    </h3>

                    <p className="text-xs text-gray-500 mt-1">
                        Overview of your tasks
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        setShowStatistics(previous => !previous)
                    }
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                >
                    {showStatistics ? "Hide −" : "Show +"}
                </button>

            </div>

            {/* Statistics Content */}

            {showStatistics && (
                <div className="border-t border-gray-100 p-4">

                    {/* Statistics Error Message */}

                    {statisticsError && (
                        <div className="mb-4 rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-600">
                            {statisticsError}
                        </div>
                    )}

                    {/* Statistics Loading State */}

                    {statisticsLoading ? (
                        <div className="py-8 text-center">
                            <div className="inline-block h-7 w-7 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600" />

                            <p className="mt-2 text-sm text-gray-500">
                                Loading statistics...
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-5">

                            {/* Main Task Statistics */}

                            <MainStatistics statistics={statistics} />

                            {/* Due Date Statistics */}

                            <DueDateOverview
                                statistics={statistics}
                                dueDateFilter={dueDateFilter}
                                setDueDateFilter={setDueDateFilter}
                            />

                            {/* Task Completion Progress */}

                            <CompletionProgress statistics={statistics} />

                            {/* Priority Breakdown */}

                            <div>
                                <h4 className="text-sm font-semibold text-gray-800 mb-3">
                                    Priority Breakdown
                                </h4>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {priorities.map(priority => (
                                        <PriorityCard
                                            key={priority.label}
                                            {...priority}
                                            percentage={getPercentage(priority.count)}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Category Breakdown */}

                            <CategoryBreakdown
                                categories={statistics.categories}
                                total={statistics.total}
                                selectedCategory={selectedCategory}
                                setSelectedCategory={setSelectedCategory}
                            />

                        </div>
                    )}

                </div>
            )}

        </div>
    );
}

export default StatisticsPanel;
