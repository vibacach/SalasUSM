import React from "react";
import { HiArrowLeft } from "react-icons/hi2";

export default function Header({ title, onBack }) {
  return (
    <div className="w-full bg-blue-600 text-white p-4 shadow-md sticky top-0 z-40">
      <div className="max-w-sm mx-auto flex items-center">
        {onBack && (
          <button
            onClick={onBack}
            className="mr-3 text-xl hover:bg-blue-700 rounded-lg p-2 transition-colors"
            aria-label="Volver atrás"
          >
            <HiArrowLeft />
          </button>
        )}
        <h1 className="text-xl font-bold">{title}</h1>
      </div>
    </div>
  );
}
