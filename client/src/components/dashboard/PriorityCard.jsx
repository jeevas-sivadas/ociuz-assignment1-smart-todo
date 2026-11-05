
function PriorityCard({
  label,
  count,
  percentage,
  wrapperClass,
  textClass,
  countClass,
  trackClass,
  barClass
}) {
  return (
    <div className={`rounded-xl border p-4 ${wrapperClass}`}>
      <div className="flex items-center justify-between">
        <span className={`text-sm font-semibold ${textClass}`}>
          {label}
        </span>
        <span className={`text-xl font-bold ${countClass}`}>
          {count}
        </span>
      </div>

      <div className={`mt-3 h-2 rounded-full overflow-hidden ${trackClass}`}>
        <div
          className={`h-full rounded-full ${barClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <p className="mt-2 text-xs text-gray-500">
        {percentage}% of all tasks
      </p>
    </div>
  );
}

export default PriorityCard;
