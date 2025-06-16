import React, { type ButtonHTMLAttributes, type ReactNode } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "outline"
    | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = "",
  disabled,
  ...props
}) => {
  const baseClasses = [
    "inline-flex items-center justify-center",
    "font-medium rounded-lg transition-all duration-200",
    "focus:outline-none focus:ring-2 focus:ring-offset-2",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    "touch-feedback",
  ].join(" ");

  const variantClasses = {
    primary: [
      "bg-primary-500 hover:bg-primary-600 text-white",
      "focus:ring-primary-500 shadow-sm hover:shadow-md",
    ].join(" "),
    secondary: [
      "bg-gray-200 hover:bg-gray-300 text-gray-900",
      "focus:ring-gray-500",
    ].join(" "),
    success: [
      "bg-success-500 hover:bg-success-600 text-white",
      "focus:ring-success-500 shadow-sm hover:shadow-md",
    ].join(" "),
    danger: [
      "bg-danger-500 hover:bg-danger-600 text-white",
      "focus:ring-danger-500 shadow-sm hover:shadow-md",
    ].join(" "),
    outline: [
      "border border-gray-300 bg-white hover:bg-gray-50",
      "text-gray-700 focus:ring-primary-500",
    ].join(" "),
    ghost: ["text-gray-700 hover:bg-gray-100", "focus:ring-gray-500"].join(" "),
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const widthClass = fullWidth ? "w-full" : "";

  const combinedClasses = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    widthClass,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const isDisabled = disabled || loading;

  return (
    <button className={combinedClasses} disabled={isDisabled} {...props}>
      {loading && (
        <div className="mr-2">
          <div className="spinner"></div>
        </div>
      )}

      {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}

      {children}

      {!loading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};

export default Button;
