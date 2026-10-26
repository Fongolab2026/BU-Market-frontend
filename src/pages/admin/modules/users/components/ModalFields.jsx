export function ModalField({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  className = '',
  required = false,
  autoComplete,
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-semibold text-base-content/80">
        {label} {required && <span className="text-rose-600">*</span>}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={`h-10 w-full rounded-lg border bg-white px-3 text-sm outline-none transition placeholder:text-base-content/40 focus:ring-4 ${
          error
            ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-100'
            : 'border-base-300 focus:border-brand focus:ring-brand/10'
        }`}
      />
      {error && <p className="mt-1 text-xs font-medium text-rose-600">{error}</p>}
    </label>
  )
}

export function ModalSelect({ label, value, onChange, error, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-base-content/80">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`h-10 w-full rounded-lg border bg-white px-3 text-sm outline-none transition focus:ring-4 ${
          error
            ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-100'
            : 'border-base-300 focus:border-brand focus:ring-brand/10'
        }`}
      >
        {children}
      </select>
      {error && <p className="mt-1 text-xs font-medium text-rose-600">{error}</p>}
    </label>
  )
}
