function TodoForm({
    showForm,
    editingTodoId,
    formData,
    formLoading,
    formError,
    categories,
    categoryLoading,
    showCategoryForm,
    categoryName,
    categoryColor,
    categoryError,
    categoryCreating,
    setFormData,
    setShowCategoryForm,
    setCategoryName,
    setCategoryColor,
    setCategoryError,
    handleSubmit,
    handleCreateCategory,
    handleUpdateCategory,
    handleEditCategory,
    handleDeleteCategory,
    handleCancelCategory,
    categoryDeleting,
    editingCategoryId,
    closeForm
}) {

    if (!showForm) {
        return null;
    }

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">

            {/* Form Header */}

            <div className="flex items-center justify-between mb-6">

                <div>
                    <h3 className="text-xl font-bold text-gray-900">
                        {editingTodoId ? "Edit Todo" : "Create Todo"}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                        {editingTodoId
                            ? "Update your task"
                            : "Add a new task to your list"}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={closeForm}
                    disabled={formLoading}
                    className="text-gray-400 hover:text-gray-600 text-xl disabled:opacity-50"
                >
                    ✕
                </button>

            </div>

            {/* Form Error */}

            {formError && (
                <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                    {formError}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

                {/* Todo Title */}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title
                    </label>

                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Enter todo title"
                        required
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                {/* Todo Description */}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                    </label>

                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter description"
                        rows="4"
                        className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                {/* Todo Due Date */}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Due Date
                    </label>

                    <input
                        type="date"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                    />

                    <p className="mt-1 text-xs text-gray-500">
                        Tasks past their due date will automatically be marked overdue.
                    </p>
                </div>

                {/* Todo Priority */}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Priority
                    </label>

                    <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>
                </div>

                {/* Todo Category */}

                <div>

                    <div className="flex items-center justify-between mb-2">

                        <label className="block text-sm font-medium text-gray-700">
                            Category
                        </label>

                        <button
                            type="button"
                            onClick={() => {
                                setShowCategoryForm((previous) => !previous);
                                setCategoryError("");
                            }}
                            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                        >
                            + Custom Category
                        </button>

                    </div>

                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        disabled={categoryLoading}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                    >
                        <option value="">
                            {categoryLoading
                                ? "Loading categories..."
                                : "No category"}
                        </option>

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

                    {/* Category List */}

                    <div className="mt-3 space-y-2">

                        {categories.map((category) => (
                            <div
                                key={category._id}
                                className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2"
                            >
                                <span className="text-sm font-medium text-gray-700">
                                    {category.name}
                                </span>

                                <div className="flex gap-3">

                                    <button
                                        type="button"
                                        onClick={() => handleEditCategory(category)}
                                        className="text-sm font-semibold text-indigo-600"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleDeleteCategory(category._id)}
                                        disabled={categoryDeleting}
                                        className="text-sm font-semibold text-red-600 disabled:opacity-50"
                                    >
                                        Delete
                                    </button>

                                </div>
                            </div>
                        ))}

                    </div>

                    {/* Custom Category Form */}

                    {showCategoryForm && (

                        <div className="mt-4 rounded-lg border border-indigo-100 bg-indigo-50 p-4">

                            <h4 className="font-semibold text-gray-900 mb-4">
                                {editingCategoryId ? "Edit Category" : "Create Custom Category"}
                            </h4>

                            {/* Category Error */}

                            {categoryError && (
                                <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-600">
                                    {categoryError}
                                </div>
                            )}

                            <div className="space-y-4">

                                {/* Category Name */}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Category Name
                                    </label>

                                    <input
                                        type="text"
                                        value={categoryName}
                                        onChange={(event) =>
                                            setCategoryName(event.target.value)
                                        }
                                        placeholder="e.g. Fitness"
                                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                {/* Category Color */}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Category Color
                                    </label>

                                    <div className="flex items-center gap-3">

                                        <input
                                            type="color"
                                            value={categoryColor}
                                            onChange={(event) =>
                                                setCategoryColor(event.target.value)
                                            }
                                            className="h-10 w-16 cursor-pointer rounded border border-gray-300"
                                        />

                                        <span className="text-sm text-gray-600">
                                            {categoryColor}
                                        </span>

                                    </div>
                                </div>

                                {/* Category Actions */}

                                <div className="flex gap-3">

                                    <button
                                        type="button"
                                        onClick={editingCategoryId
                                            ? handleUpdateCategory
                                            : handleCreateCategory
                                        }
                                        disabled={categoryCreating}
                                        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {categoryCreating
                                            ? editingCategoryId ? "Updating..." : "Creating..."
                                            : editingCategoryId ? "Update Category" : "Create Category"
                                        }
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleCancelCategory}
                                        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>

                                </div>

                            </div>

                        </div>
                    )}

                </div>

                {/* Form Actions */}

                <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">

                    <button
                        type="button"
                        onClick={closeForm}
                        disabled={formLoading}
                        className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={formLoading}
                        className="rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {formLoading
                            ? editingTodoId
                                ? "Updating..."
                                : "Creating..."
                            : editingTodoId
                                ? "Update Todo"
                                : "Create Todo"}
                    </button>

                </div>

            </form>

        </div>
    );
}

export default TodoForm;
