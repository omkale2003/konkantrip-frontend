function Input({
  label,
  error,
  id,
  required = false,
  className = "",
  rightElement,
  ...props
}) {
  const inputClasses = [
    "min-h-11 w-full rounded-lg border bg-white px-3 text-slate-900 outline-none transition",
    "placeholder:text-slate-400",
    "disabled:cursor-not-allowed disabled:bg-slate-100",
    rightElement ? "pr-10" : "",
    error
      ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100"
      : "border-slate-300 hover:border-slate-400 focus:border-konkan-500 focus:ring-2 focus:ring-konkan-100",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label
          className="text-sm font-medium text-slate-700"
          htmlFor={id}
        >
          {label}

          {required && (
            <span
              className="ml-1 text-red-500"
              aria-hidden="true"
            >
              *
            </span>
          )}
        </label>
      )}

      <div className="relative flex items-center">
        <input
          id={id}
          className={inputClasses}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-0 mr-3 flex items-center justify-center text-slate-400">
            {rightElement}
          </div>
        )}
      </div>

      {error && (
        <p
          id={`${id}-error`}
          className="m-0 text-xs text-red-600"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}

export default Input;