import { formatDate } from "../../utils/dateUtils";
import { getPriorityClass } from "../../utils/todoUtils";

function TodoCard({
    todo,
    handleToggle,
    handleEdit,
    handleDelete
}) {
    return (
        <div
            className={`bg-white rounded-xl shadow-sm border p-5 transition ${
                todo.completed ? "opacity-75" : ""
            } ${
                todo.overdue
                    ? "border-red-300"
                    : "border-gray-200"
            }`}
        >
            <div className="flex items-start gap-4">

                {/* Completion Button */}

                <button
                    type="button"
                    onClick={() => handleToggle(todo._id)}
                    className={`mt-1 h-6 w-6 flex-shrink-0 rounded-full border-2 flex items-center justify-center transition ${
                        todo.completed
                            ? "bg-green-500 border-green-500 text-white"
                            : "border-gray-300 hover:border-indigo-500"
                    }`}
                    title={
                        todo.completed
                            ? "Mark incomplete"
                            : "Mark complete"
                    }
                >
                    {todo.completed && (
                        <span className="text-sm">✓</span>
                    )}
                </button>

                <div className="flex-1 min-w-0">

                    {/* Todo Title and Description */}

                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">

                        <div>
                            <h3
                                className={`text-lg font-semibold break-words ${
                                    todo.completed
                                        ? "line-through text-gray-400"
                                        : "text-gray-900"
                                }`}
                            >
                                {todo.title}
                            </h3>

                            {todo.description && (
                                <p className="mt-1 text-sm text-gray-500 break-words">
                                    {todo.description}
                                </p>
                            )}
                        </div>

                        {/* Edit and Delete Buttons */}

                        <div className="flex items-center gap-2 flex-shrink-0">

                            <button
                                type="button"
                                onClick={() => handleEdit(todo)}
                                className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-100"
                            >
                                ✏ Edit
                            </button>

                            <button
                                type="button"
                                onClick={() => handleDelete(todo._id)}
                                className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
                            >
                                🗑 Delete
                            </button>

                        </div>
                    </div>

                    {/* Todo Details */}

                    <div className="flex flex-wrap items-center gap-2 mt-4">

                        <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getPriorityClass(todo.priority)}`}
                        >
                            {todo.priority} priority
                        </span>

                        {todo.category && (
                            <span
                                className="rounded-full px-3 py-1 text-xs font-semibold text-white"
                                style={{
                                    backgroundColor:
                                        todo.category.color || "#6366f1"
                                }}
                            >
                                {todo.category.name}
                            </span>
                        )}

                        {todo.dueDate && (
                            <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                    todo.overdue
                                        ? "bg-red-100 text-red-700"
                                        : "bg-gray-100 text-gray-600"
                                }`}
                            >
                                {todo.overdue
                                    ? "⚠ Overdue · "
                                    : "Due · "}

                                {formatDate(todo.dueDate)}
                            </span>
                        )}

                        {!todo.dueDate && (
                            <span className="rounded-full bg-gray-100 text-gray-500 px-3 py-1 text-xs font-semibold">
                                No due date
                            </span>
                        )}

                        {todo.completed && (
                            <span className="rounded-full bg-green-100 text-green-700 px-3 py-1 text-xs font-semibold">
                                ✓ Completed
                            </span>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}

export default TodoCard;