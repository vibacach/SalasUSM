import React from "react";
import { HiArrowLeft } from "react-icons/hi2";
import fondoUSM from '../assets/usm-costado.jpeg';

export default function Header({ title, onBack }) {
  return (
    <div className="relative w-full bg-blue-600 text-white p-4 shadow-md sticky top-0 z-40 overflow-hidden">

      {/* Imagen de fondo con transparencia */}
      <img
        src={fondoUSM}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
      />

      {/* Contenido del header */}
      <div className="relative max-w-sm mx-auto flex items-center">
        {onBack && (
          <button
            onClick={onBack}
            className="mr-3 text-xl hover:bg-blue-700/50 rounded-lg p-2 transition-colors"
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