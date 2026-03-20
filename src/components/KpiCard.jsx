export default function KpiCard({ title, value, icon, isCurrency = true, onClick }) {
  return (
    <div
      onClick={onClick}
      className="
        cursor-pointer
        bg-white
        dark:bg-slate-900
        border border-gray-200 dark:border-slate-800
        rounded-xl
        p-6
        shadow-sm
        hover:shadow-md
        transition
      "
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>

          <p className="text-2xl font-semibold mt-2 text-gray-900 dark:text-white">
            {isCurrency && "₹"}
            {value}
          </p>
        </div>

        <div className="bg-yellow-100 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 p-2 rounded-lg">
          {icon}
        </div>
      </div>
    </div>
  );
}