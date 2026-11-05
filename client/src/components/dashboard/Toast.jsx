function Toast({ toast, setToast }) {
    if (!toast.show) {
        return null;
    }

    return (
        <div className="fixed top-5 right-5 z-[100] w-[calc(100%-2rem)] max-w-sm">

            <div
                className={`rounded-xl border shadow-lg px-4 py-4 flex items-start gap-3 ${
                    toast.type === "error"
                        ? "bg-red-50 border-red-200"
                        : "bg-green-50 border-green-200"
                }`}
            >

                <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        toast.type === "error"
                            ? "bg-red-100 text-red-600"
                            : "bg-green-100 text-green-600"
                    }`}
                >
                    {toast.type === "error" ? "!" : "✓"}
                </div>

                <div className="flex-1">

                    <p
                        className={`text-sm font-semibold ${
                            toast.type === "error"
                                ? "text-red-800"
                                : "text-green-800"
                        }`}
                    >
                        {toast.type === "error" ? "Error" : "Success"}
                    </p>

                    <p
                        className={`text-sm mt-1 ${
                            toast.type === "error"
                                ? "text-red-700"
                                : "text-green-700"
                        }`}
                    >
                        {toast.message}
                    </p>

                </div>

                <button
                    type="button"
                    onClick={() =>
                        setToast({
                            show: false,
                            type: "success",
                            message: ""
                        })
                    }
                    className="text-gray-400 hover:text-gray-600"
                >
                    ✕
                </button>

            </div>

        </div>
    );
}

export default Toast;