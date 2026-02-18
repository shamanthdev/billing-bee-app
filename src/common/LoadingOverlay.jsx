export default function LoadingOverlay({ show, text = "Loading..." }) {
  if (!show) return null;

  return (
    <div
      style={{ zIndex: 9999 }}
      className="fixed inset-0 flex items-center justify-center"
    >
      {/* Dark transparent background */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
      />

      {/* Loader box */}
      <div className="relative flex flex-col items-center gap-3">
        {/* Spinner */}
        <div
          className="
            h-14 w-14
            border-4
            border-white/30
            border-t-white
            rounded-full
            animate-spin
          "
        />

        {/* Text */}
        <span className="text-white text-sm tracking-wide">
          {text}
        </span>
      </div>
    </div>
  );
}
