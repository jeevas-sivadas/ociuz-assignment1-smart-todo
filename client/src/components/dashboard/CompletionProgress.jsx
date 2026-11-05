function CompletionProgress({ statistics }) {
    return (
        <div className="mt-6 rounded-xl border p-5">
            <div className="flex items-center justify-between mb-3">
                <div>
                    <h4 className="font-semibold text-gray-900">
                        Completion Progress
                    </h4>
                    <p className="text-sm text-gray-500">
                        {statistics.completed} of{" "}
                        {statistics.total} tasks completed
                    </p>
                </div>
                <span className="text-lg font-bold text-indigo-600">
                    {statistics.completionPercentage}%
                </span>
            </div>

            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                    style={{
                        width: `${statistics.completionPercentage}%`
                    }}
                />
            </div>
        </div>
    );
}

export default CompletionProgress;