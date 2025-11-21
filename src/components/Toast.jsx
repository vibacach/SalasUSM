import React, { useEffect } from "react";
import { HiCheckCircle, HiXCircle } from "react-icons/hi2";

export default function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
    info: "bg-blue-500 text-white",
  };

  const icons = {
    success: <HiCheckCircle className="text-2xl" />,
    error: <HiXCircle className="text-2xl" />,
    info: <HiCheckCircle className="text-2xl" />,
  };

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-slide-down px-4 w-full max-w-md">
      <div
        className={`${styles[type]} px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3`}
        role="alert"
        aria-live="polite"
      >
        {icons[type]}
        <span className="font-medium text-sm leading-tight flex-1">{message}</span>
      </div>
    </div>
  );
}
