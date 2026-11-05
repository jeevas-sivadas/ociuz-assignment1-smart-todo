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

    const getPercentage = (value) => {
        return statistics.total > 0
            ? Math.round((value / statistics.total) * 100)
            : 0;
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border mb-6 overflow-hidden">

            {/* Statistics Panel Header */}

            <div className="flex items-center justify-between px-6 py-5 border-b">

                <div>
                    <h3 className="text-lg font-bold text-gray-900">
                        Task Statistics
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                        Overview of all your tasks
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        setShowStatistics(
                            (previous) => !previous
                        )
                    }
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                    {showStatistics ? "Hide" : "Show"}
                </button>

            </div>

            {showStatistics && (

                <div className="p-6">

                    {/* Statistics Error Message */}

                    {statisticsError && (
                        <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                            {statisticsError}
                        </div>
                    )}

                    {/* Statistics Loading State */}

                    {statisticsLoading ? (

                        <div className="py-10 text-center">

                            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600" />

                            <p className="mt-3 text-gray-500">
                                Loading statistics...
                            </p>

                        </div>

                    ) : (

                        <>

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

                            <div className="mt-6">

                                <h4 className="font-semibold text-gray-900 mb-4">
                                    Priority Breakdown
                                </h4>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                                    <PriorityCard
                                        label="High Priority"
                                        count={statistics.priority.high}
                                        percentage={getPercentage(statistics.priority.high)}
                                        wrapperClass="bg-red-50 border-red-100"
                                        textClass="text-red-700"
                                        countClass="text-red-800"
                                        trackClass="bg-red-100"
                                        barClass="bg-red-500"
                                    />

                                    <PriorityCard
                                        label="Medium Priority"
                                        count={statistics.priority.medium}
                                        percentage={getPercentage(statistics.priority.medium)}
                                        wrapperClass="bg-yellow-50 border-yellow-100"
                                        textClass="text-yellow-700"
                                        countClass="text-yellow-800"
                                        trackClass="bg-yellow-100"
                                        barClass="bg-yellow-500"
                                    />

                                    <PriorityCard
                                        label="Low Priority"
                                        count={statistics.priority.low}
                                        percentage={getPercentage(statistics.priority.low)}
                                        wrapperClass="bg-green-50 border-green-100"
                                        textClass="text-green-700"
                                        countClass="text-green-800"
                                        trackClass="bg-green-100"
                                        barClass="bg-green-500"
                                    />

                                </div>

                            </div>

                            {/* Category Breakdown */}

                            <CategoryBreakdown
                                categories={statistics.categories}
                                total={statistics.total}
                                selectedCategory={selectedCategory}
                                setSelectedCategory={setSelectedCategory}
                            />

                        </>

                    )}

                </div>

            )}

        </div>
    );
}

export default StatisticsPanel;
