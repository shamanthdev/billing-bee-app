import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export default function SelectOption({
  options = [],
  value,
  onChange,
  placeholder = "Select option",
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative w-full" ref={ref}>
      {/* Trigger */}
      <div
        onClick={() => setOpen(!open)}
        className="
          flex items-center justify-between
          px-4 py-2.5 rounded-md
          border border-gray-300 dark:border-gray-700
          bg-white dark:bg-[#1f1f1f]
          cursor-pointer
          hover:border-gray-400
          focus-within:ring-2 focus-within:ring-primary
          transition
        "
      >
        <span className="text-sm text-gray-800 dark:text-gray-200">
          {selected ? selected.label : placeholder}
        </span>

        <ChevronDown
          size={16}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </div>

      {/* Dropdown */}
      {open && (
        <div
          className="
            absolute z-50 mt-2 w-full
            rounded-md border border-gray-200 dark:border-gray-800
            bg-white dark:bg-[#141414]
            shadow-lg
            overflow-hidden
            animate-in fade-in zoom-in-95 duration-100
          "
        >
          {/* Search */}
          <div className="p-2 border-b border-gray-200 dark:border-gray-800">
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="
                w-full px-3 py-2 rounded-md text-sm
                bg-gray-100 dark:bg-[#1f1f1f]
                border border-gray-300 dark:border-gray-700
                focus:outline-none focus:ring-2 focus:ring-primary
              "
            />
          </div>

          <div className="max-h-56 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500">
                No results found
              </div>
            ) : (
              filtered.map((option) => (
                <div
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                    setSearch("");
                  }}
                  className="
                    px-4 py-2 text-sm cursor-pointer
                    hover:bg-gray-100 dark:hover:bg-[#202020]
                    transition
                  "
                >
                  {option.label}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}