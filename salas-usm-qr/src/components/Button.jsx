import React from "react";

export default function Button({ 
  children, 
  onClick, 
  variant = "primary", 
  size = "normal",
  disabled = false,
  className = ""
}) {
  const baseStyles = "font-semibold rounded-xl shadow transition-all duration-200";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800",
    success: "bg-green-600 text-white hover:bg-green-700 active:bg-green-800",
    danger: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 active:bg-gray-400",
    disabled: "bg-gray-400 text-white cursor-not-allowed",
  };

  const sizes = {
    small: "py-2 px-4 text-sm",
    normal: "py-3 px-6 text-base",
    large: "py-4 px-8 text-lg",
  };

  const style = disabled ? variants.disabled : variants[variant];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${style} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}
