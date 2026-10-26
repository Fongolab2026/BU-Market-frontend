import { ChevronDown } from 'lucide-react'

const fieldBase =
  'h-11 w-full rounded-xl border bg-(--surface) text-sm text-base-content transition-colors duration-200 placeholder:text-base-content/40 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60'
const fieldIdle = 'border-base-300 hover:border-primary/45 focus:border-primary focus:ring-4 focus:ring-primary/15'
const fieldInvalid = 'border-error focus:border-error focus:ring-4 focus:ring-error/15'

function FieldLabel({ htmlFor, label, required }) {
  return (
    <label htmlFor={htmlFor} className="text-[13px] font-semibold text-base-content/90">
      {label}
      {required && <span className="ml-0.5 text-error" aria-hidden="true">*</span>}
    </label>
  )
}

function FieldMessages({ hint, error }) {
  if (error) return <p className="text-xs leading-4 text-error">{[].concat(error).join(' ')}</p>
  if (hint) return <p className="text-[11px] leading-4 text-base-content/45">{hint}</p>
  return null
}

export function Field({
  label,
  name,
  value,
  onChange,
  type = 'text',
  required = false,
  placeholder,
  error,
  hint,
  readOnly = false,
  icon: Icon,
  autoComplete,
  children,
  className = '',
}) {
  return (
    <div className={`flex min-w-0 flex-col gap-2 ${className}`}>
      <FieldLabel htmlFor={name} label={label} required={required} />
      {children || (
        <div className="relative">
          {Icon && (
            <Icon
              size={17}
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/35"
            />
          )}
          <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            readOnly={readOnly}
            autoComplete={autoComplete}
            aria-readonly={readOnly ? 'true' : undefined}
            aria-invalid={error ? 'true' : undefined}
            className={`${fieldBase} ${error ? fieldInvalid : fieldIdle} pr-3.5 ${Icon ? 'pl-10' : 'pl-3.5'} ${
              readOnly ? 'cursor-not-allowed bg-base-200/60 text-base-content/65' : ''
            }`}
          />
        </div>
      )}
      <FieldMessages hint={hint} error={error} />
    </div>
  )
}

export function SelectField({
  label,
  name,
  value,
  onChange,
  required = false,
  error,
  hint,
  disabled = false,
  icon: Icon,
  children,
  className = '',
}) {
  return (
    <div className={`flex min-w-0 flex-col gap-2 ${className}`}>
      <FieldLabel htmlFor={name} label={label} required={required} />
      <div className="relative">
        {Icon && (
          <Icon
            size={17}
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/35"
          />
        )}
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          aria-invalid={error ? 'true' : undefined}
          className={`${fieldBase} ${error ? fieldInvalid : fieldIdle} cursor-pointer appearance-none pr-10 ${
            Icon ? 'pl-10' : 'pl-3.5'
          }`}
        >
          {children}
        </select>
        <ChevronDown
          size={16}
          aria-hidden="true"
          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-base-content/40"
        />
      </div>
      <FieldMessages hint={hint} error={error} />
    </div>
  )
}
