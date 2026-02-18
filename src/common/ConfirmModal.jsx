export default function ConfirmModal({
  open,
  title = "Confirm",
  message,
  subMessage,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  danger = false,   // 🔴 danger variant
  loading = false,  // ⏳ loading state
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/30"
        onClick={!loading ? onCancel : undefined}
      />

      {/* Modal */}
      <div
        className="
          relative
          w-[420px]
          bg-white
          rounded-md
          shadow-lg
          mx-auto
          mt-24
          animate-slideDown
        "
      >
        {/* Header */}
        <div className="px-5 py-3 border-b flex justify-between items-center">
          <h3 className="text-sm font-semibold text-gray-800">
            {title}
          </h3>
          <button
            onClick={onCancel}
            disabled={loading}
            className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 text-sm text-gray-700">
          <p className="mb-2">{message}</p>
          {subMessage && (
            <p className="font-medium text-gray-900">
              {subMessage}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-1.5 border rounded-md text-sm disabled:opacity-50"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className={`
              px-4 py-1.5
              rounded-md
              text-sm
              text-white
              ${
                danger
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }
              disabled:opacity-60
              disabled:cursor-not-allowed
            `}
          >
            {loading ? "Please wait..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
