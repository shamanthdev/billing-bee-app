function FormField({
  label,
  required,
  name,
  value,
  onChange,
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border rounded px-3 py-2 text-sm"
      />
    </div>
  );
}

export default FormField;