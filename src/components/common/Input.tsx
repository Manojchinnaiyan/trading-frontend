import React, { InputHTMLAttributes, ReactNode, forwardRef } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      fullWidth = true,
      className = "",
      ...props
    },
    ref
  ) => {
    const baseInputClasses = [
      "block w-full px-3 py-2 border rounded-md shadow-sm",
      "placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0",
      "transition-colors duration-200 text-sm",
    ].join(" ");

    const stateClasses = error
      ? "border-danger-300 text-danger-900 focus:ring-danger-500 focus:border-danger-500"
      : "border-gray-300 focus:ring-primary-500 focus:border-primary-500";

    const iconPaddingClasses = leftIcon ? "pl-10" : rightIcon ? "pr-10" : "";

    const inputClasses = [
      baseInputClasses,
      stateClasses,
      iconPaddingClasses,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const containerClasses = fullWidth ? "w-full" : "";

    return (
      <div className={`space-y-1 ${containerClasses}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400 text-sm">{leftIcon}</span>
            </div>
          )}

          <input ref={ref} className={inputClasses} {...props} />

          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <span className="text-gray-400 text-sm">{rightIcon}</span>
            </div>
          )}
        </div>

        {error && (
          <p className="text-sm text-danger-600 flex items-center">
            <span className="mr-1">⚠️</span>
            {error}
          </p>
        )}

        {helperText && !error && (
          <p className="text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
