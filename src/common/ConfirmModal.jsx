import { createPortal } from "react-dom";

export default function ConfirmModal({
  open,
  title,
  message,
  subMessage,
  danger = false,
  loading = false,
  confirmText = "Confirm",
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl bg-white dark:bg-[#1c1c1c] shadow-2xl overflow-hidden animate-fadeIn">

        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            {title}
          </h2>

          <button
            onClick={onCancel}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {message}
          </p>

          {subMessage && (
            <p className="text-xs text-gray-500 mt-2">
              {subMessage}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-[#141414] border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-5 py-2 text-sm rounded-md font-medium transition ${
              danger
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            } disabled:opacity-50`}
          >
            {loading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}