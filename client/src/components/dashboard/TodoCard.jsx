
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
            className={`bg-white border border-gray-100 rounded-md px-4 py-3 transition hover:shadow-sm ${
                todo.completed ? "opacity-60" : ""
            } ${
                todo.overdue ? "border-l-4 border-l-red-400" : ""
            }`}
        >
            <div className="flex items-start gap-3">

                {/* Completion Button */}

                <button
                    type="button"
                    onClick={() => handleToggle(todo._id)}
                    className={`mt-1 h-6 w-6 flex-shrink-0 rounded-full border-2 flex items-center justify-center transition ${
                        todo.completed
                            ? "bg-green-500 border-green-500 text-white"
                            : "border-gray-400 hover:border-blue-500"
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

                    {/* Todo Title */}

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">

                        <div className="min-w-0">

                            <h3
                                className={`text-base font-medium break-words ${
                                    todo.completed
                                        ? "line-through text-gray-400"
                                        : "text-gray-800"
                                }`}
                            >
                                {todo.title}
                            </h3>

                            {/* Category */}

                            <div className="flex flex-wrap items-center gap-2 mt-1">

                                {todo.category && (
                                    <span
                                        className="text-xs font-medium"
                                        style={{
                                            color: todo.category.color || "#6366f1"
                                        }}
                                    >
                                        {todo.category.name}
                                    </span>
                                )}

                                {todo.dueDate && (
                                    <span
                                        className={`text-xs ${
                                            todo.overdue
                                                ? "text-red-600"
                                                : "text-gray-500"
                                        }`}
                                    >
                                        {todo.overdue
                                            ? "⚠ Overdue · "
                                            : "📅 "}
                                        {formatDate(todo.dueDate)}
                                    </span>
                                )}

                                {todo.completed && (
                                    <span className="text-xs text-green-600">
                                        ✓ Completed
                                    </span>
                                )}

                            </div>

                            {/* Description */}

                            {todo.description && (
                                <p className="mt-2 text-sm text-gray-500 break-words">
                                    {todo.description}
                                </p>
                            )}

                            {/* Priority */}

                            <div className="mt-2">
                                <span
                                    className={`rounded-full px-2 py-1 text-xs font-medium capitalize ${getPriorityClass(todo.priority)}`}
                                >
                                    {todo.priority} priority
                                </span>
                            </div>

                        </div>

                        {/* Edit and Delete Buttons */}

                        <div className="flex items-center gap-3 flex-shrink-0">

                            <button
                                type="button"
                                onClick={() => handleEdit(todo)}
                                className="text-sm text-gray-400 hover:text-blue-600 transition"
                                title="Edit todo"
                            >
                                ✏
                            </button>

                            <button
                                type="button"
                                onClick={() => handleDelete(todo._id)}
                                className="text-sm text-gray-400 hover:text-red-600 transition"
                                title="Delete todo"
                            >
                                🗑
                            </button>

                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
}

export default TodoCard;
