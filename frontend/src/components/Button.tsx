import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "warning";
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  children,
  className = "",
  disabled = false,
  ...props
}) => {
  const baseClasses =
    "px-6 py-3 rounded-full font-semibold shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  let variantClasses = "";

  switch (variant) {
    case "primary":
      variantClasses =
        "bg-white text-[#FF5722] hover:bg-gray-100 hover:scale-105 focus:ring-[#FF5722]";
      break;
    case "secondary":
      variantClasses =
        "bg-[#FFCCBC] text-[#BF360C] hover:bg-[#FFE0B2] hover:scale-105 focus:ring-[#BF360C]";
      break;
    case "warning":
      variantClasses =
        "bg-[#FF5722] text-white hover:bg-[#E64A19] hover:scale-105 focus:ring-[#FF5722]";
      break;
  }

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
