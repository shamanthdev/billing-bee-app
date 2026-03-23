import React from "react";
import clsx from "clsx";

type ButtonVariant = "primary" | "secondary" | "danger" | "dark";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  disabled = false,
  icon,
  onClick,
  type = "button",
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition rounded-md focus:outline-none";

  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-primary hover:bg-primaryHover text-black shadow-soft hover:shadow-md",
    secondary:
      "border border-borderLight dark:border-borderDark hover:bg-gray-50 dark:hover:bg-[#1f1f1f]",
    danger:
      "bg-red-600 hover:bg-red-700 text-white",
    dark:
      "bg-black hover:bg-gray-900 text-white",
  };

  const sizes: Record<ButtonSize, string> = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={clsx(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        (disabled || loading) && "opacity-50 cursor-not-allowed"
      )}
    >
      {loading ? (
        "Processing..."
      ) : (
        <>
          {icon && <span className="mr-2">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
}