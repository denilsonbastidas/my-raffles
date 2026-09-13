import { TextareaHTMLAttributes } from "react";

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  required?: boolean;
}

export default function Textarea({
  label,
  error,
  required,
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
      <textarea
        id={id}
        className={`w-full px-3.5 py-2.5 rounded-xl border ${
          error ? "border-danger" : "border-gray-300 dark:border-gray-600"
        } bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none focus:border-primary transition ${className}`}
        {...rest}
      />
      {error && <p className="text-danger text-xs mt-1">{error}</p>}
    </div>
  );
}
