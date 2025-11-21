import React from "react";
import { HiHome, HiCamera, HiCalendar, HiClipboardDocumentList } from "react-icons/hi2";

export default function BottomNav({ vistaActual, onNavigate }) {
  const navItems = [
    {
      id: "home",
      icon: HiHome,
      label: "Inicio",
    },
    {
      id: "escanear",
      icon: HiCamera,
      label: "Escanear",
    },
    {
      id: "horarios",
      icon: HiCalendar,
      label: "Horarios",
    },
    {
      id: "reservas",
      icon: HiClipboardDocumentList,
      label: "Reservas",
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="max-w-sm mx-auto px-2 py-2">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center justify-center px-4 py-2 rounded-lg transition-all ${
                  vistaActual === item.id
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-blue-500 hover:bg-gray-50"
                }`}
                aria-label={`Navegar a ${item.label}`}
                aria-current={vistaActual === item.id ? "page" : undefined}
              >
                <Icon className="text-2xl mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
