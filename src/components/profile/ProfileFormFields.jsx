import PhoneInput from '../PhoneInput.jsx'

export function Field({
  label,
  name,
  value,
  onChange,
  type = 'text',
  required = false,
  placeholder,
  error,
  readOnly = false,
  isPhone = false,
  defaultCountry,
  className = '',
}) {
  return (
    <div className={`flex min-w-0 flex-col gap-2 ${className}`}>
      <label htmlFor={name} className="text-sm font-semibold text-base-content">
        {label}
        {required && (
          <span className="ml-1 text-error" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {isPhone ? (
        <PhoneInput
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          defaultCountry={defaultCountry}
          error={error || undefined}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          readOnly={readOnly}
          aria-invalid={error ? 'true' : undefined}
          className={`input input-bordered w-full bg-base-100 ${readOnly ? 'cursor-not-allowed opacity-60' : ''} ${error ? 'input-error' : ''}`}
        />
      )}
      {error && <p className="text-xs text-error">{error}</p>}
    </div>
  )
}

export function Card({ icon: Icon, title, description, children, footer }) {
  return (
    <section className="rounded-2xl border border-base-300 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-base-300/70 p-5">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
          <Icon className="size-5" />
        </span>
        <div className="min-w-0">
          <h2 className="text-base font-bold">{title}</h2>
          {description && (
            <p className="mt-0.5 text-xs text-base-content/55">{description}</p>
          )}
        </div>
      </div>
      <div className="p-5">{children}</div>
      {footer && (
        <div className="flex flex-col gap-3 border-t border-base-300/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-end">
          {footer}
        </div>
      )}
    </section>
  )
}
