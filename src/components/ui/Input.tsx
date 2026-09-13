import { InputHTMLAttributes, ReactNode } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  required?: boolean;
  icon?: ReactNode;
}

// Shared input primitive — consistent label, spacing, error state across all forms.
export default function Input({
  label,
  error,
  required,
  icon,
  className = "",
  id,
  ...rest
}: Props) {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="flex items-center gap-1 text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1.5"
        >
          {label}
          {required && <span className="text-danger">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </span>
        )}
        <input
          id={id}
          className={`w-full ${icon ? "pl-10" : "px-3.5"} py-2.5 pr-3.5 rounded-xl border ${
            error ? "border-danger" : "border-gray-300 dark:border-gray-600"
          } bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none focus:border-primary transition ${className}`}
          {...rest}
        />
      </div>
      {error && <p className="text-danger text-xs mt-1">{error}</p>}
    </div>
  );
}
