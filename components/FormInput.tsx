import React from "react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function FormInput({
  label,
  error,
  className = "",
  ...props
}: FormInputProps) {
  return (
    <div className="w-full mb-4">
      <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        className={`w-full border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base transition duration-200 ${
          error ? "border-red-500 focus:ring-red-400" : ""
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs sm:text-sm text-red-600">{error}</p>}
    </div>
  );
}
