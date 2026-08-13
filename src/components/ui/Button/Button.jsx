function Button({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  className = "",
  ...props
}) {
  const baseClasses =
    "inline-flex items-center justify-center gap-2 rounded-lg border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-konkan-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

  const variants = {
    primary:
      "border-konkan-600 bg-konkan-600 text-white hover:border-konkan-700 hover:bg-konkan-700",

    secondary:
      "border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
  };

  const sizes = {
    sm: "min-h-9 px-3 text-sm",
    md: "min-h-11 px-5 text-sm",
    lg: "min-h-12 px-6 text-base",
  };

  const classes = [
    baseClasses,
    variants[variant] || variants.primary,
    sizes[size] || sizes.md,
    fullWidth ? "w-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;