function MainStatistics({ statistics }) {
    const mainStats = [
        {
            label: "Total Tasks",
            value: statistics.total,
            icon: "📋",
            cardClass: "bg-indigo-50 border-indigo-100",
            labelClass: "text-indigo-600",
            valueClass: "text-indigo-900",
            iconClass: "bg-indigo-100"
        },
        {
            label: "Completed",
            value: statistics.completed,
            icon: "✓",
            cardClass: "bg-green-50 border-green-100",
            labelClass: "text-green-600",
            valueClass: "text-green-900",
            iconClass: "bg-green-100"
        },
        {
            label: "Active",
            value: statistics.active,
            icon: "⏳",
            cardClass: "bg-yellow-50 border-yellow-100",
            labelClass: "text-yellow-600",
            valueClass: "text-yellow-900",
            iconClass: "bg-yellow-100"
        },
        {
            label: "Overdue",
            value: statistics.overdue,
            icon: "⚠️",
            cardClass: "bg-red-50 border-red-100",
            labelClass: "text-red-600",
            valueClass: "text-red-900",
            iconClass: "bg-red-100"
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {mainStats.map((stat) => (
                <div
                    key={stat.label}
                    className={`rounded-xl border p-5 ${stat.cardClass}`}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className={`text-sm font-medium ${stat.labelClass}`}>
                                {stat.label}
                            </p>

                            <p className={`text-3xl font-bold mt-2 ${stat.valueClass}`}>
                                {stat.value}
                            </p>
                        </div>

                        <div className={`h-12 w-12 rounded-full flex items-center justify-center text-2xl ${stat.iconClass}`}>
                            {stat.icon}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default MainStatistics;