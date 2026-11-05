function DeleteConfirmation({
    deleteTodoId,
    deleteLoading,
    cancelDelete,
    confirmDelete
}) {

    if (!deleteTodoId) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">

            <div
                className="absolute inset-0 bg-black/50"
                onClick={cancelDelete}
            />

            <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl">

                <div className="p-6">

                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-2xl">
                        🗑️
                    </div>

                    <div className="mt-5 text-center">

                        <h3 className="text-xl font-bold text-gray-900">
                            Delete Todo?
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-gray-500">
                            Are you sure you want to delete this todo?
                            This action cannot be undone.
                        </p>

                    </div>

                    <div className="mt-6 flex flex-col-reverse sm:flex-row gap-3">

                        <button
                            type="button"
                            onClick={cancelDelete}
                            disabled={deleteLoading}
                            className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            onClick={confirmDelete}
                            disabled={deleteLoading}
                            className="flex-1 rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {deleteLoading
                                ? "Deleting..."
                                : "Yes, Delete"}
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default DeleteConfirmation;