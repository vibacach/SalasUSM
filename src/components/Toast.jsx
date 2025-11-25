import React, { useEffect } from "react";
import { HiCheckCircle, HiXCircle, HiInformationCircle } from "react-icons/hi2";

export default function Toast({ message, type = "success", onClose, action, duration = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const styles = {
    success: "bg-green-600 text-white",
    error: "bg-red-600 text-white",
    info: "bg-gray-800 text-white",
  };

  const icons = {
    success: <HiCheckCircle className="text-2xl flex-shrink-0" />,
    error: <HiXCircle className="text-2xl flex-shrink-0" />,
    info: <HiInformationCircle className="text-2xl flex-shrink-0" />,
  };

  return (
    <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50 animate-slide-down w-[90%] max-w-md">
      <div
        className={`${styles[type]} px-4 py-3 rounded-lg shadow-2xl flex items-center justify-between gap-3 relative overflow-hidden`}
        role="alert"
      >
        {/* Contenido Principal */}
        <div className="flex items-center gap-3 flex-1 z-10">
          {icons[type]}
          <span className="font-medium text-sm">{message}</span>
        </div>
        
        {/* Botón de Acción (Opcional) */}
        {action && (
          <button
            onClick={action.onClick}
            className="z-10 text-sm font-bold text-blue-300 hover:text-blue-100 uppercase tracking-wide px-2 py-1 rounded transition-colors border border-transparent hover:border-blue-300/30 whitespace-nowrap"
          >
            {action.label}
          </button>
        )}

        {/* Barra de Progreso Animada */}
        <div 
          className="absolute bottom-0 left-0 h-1 bg-white/40 animate-shrink origin-left"
          style={{ 
            animationDuration: `${duration}ms` 
          }}
        />
      </div>
    </div>
  );
}
