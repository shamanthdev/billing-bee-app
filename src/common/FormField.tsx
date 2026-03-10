import { ChangeEvent } from "react";

interface FormFieldProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  type?: string;
  disabled?: boolean;
  placeholder?: string;
}

function FormField({
  label,
  required = false,
  name,
  value,
  onChange,
  type = "text",
  disabled = false,
  placeholder,
}: FormFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className="
          w-full
          rounded-lg
          border border-gray-300 dark:border-white/10
          bg-white dark:bg-slate-800
          px-3 py-2.5
          text-sm
          text-gray-900 dark:text-gray-200
          focus:outline-none
          focus:ring-2 focus:ring-yellow-500
          focus:border-transparent
          transition
          disabled:opacity-60 disabled:cursor-not-allowed
        "
      />
    </div>
  );
}

export default FormField;