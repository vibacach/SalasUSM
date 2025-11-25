import React, { useState, useEffect } from "react";
import Home from "./pages/Home";
import EscanearQR from "./pages/EscanearQR";
import DetalleSala from "./pages/DetalleSala";
import MisReservas from "./pages/MisReservas";
import HorarioSalas from "./pages/HorarioSalas";
import GeneradorQR from "./pages/GeneradorQR";
import BottomNav from "./components/BottomNav";
import Toast from "./components/Toast";
import { reservasIniciales } from "./data/mockData";

export default function App() {
  // Estado de navegación
  const [vistaActual, setVistaActual] = useState("home");
  
  // Estado de datos
  const [salaSeleccionada, setSalaSeleccionada] = useState(null);
  const [toast, setToast] = useState(null);

  // --- PERSISTENCIA LOCAL ---
  const [reservas, setReservas] = useState(() => {
    const reservasGuardadas = localStorage.getItem("reservasUSM");
    return reservasGuardadas ? JSON.parse(reservasGuardadas) : reservasIniciales;
  });

  useEffect(() => {
    localStorage.setItem("reservasUSM", JSON.stringify(reservas));
  }, [reservas]);
  // --------------------------

  const handleNavigate = (vista) => {
    setVistaActual(vista);
  };

  const handleSalaSeleccionada = (sala) => {
    setSalaSeleccionada(sala);
  };

  const handleReservar = (sala, bloque, fecha) => {
    const fechaObj = fecha ? new Date(fecha + 'T00:00:00') : new Date();
    const dia = String(fechaObj.getDate()).padStart(2, '0');
    const mes = String(fechaObj.getMonth() + 1).padStart(2, '0');
    const anio = fechaObj.getFullYear();
    const fechaFormateada = `${dia}/${mes}/${anio}`;

    const nuevaReserva = {
      id: Date.now(),
      sala: sala.nombre,
      bloque: bloque,
      fecha: fechaFormateada,
      usuario: "Usuario Demo",
    };
    setReservas([...reservas, nuevaReserva]);
    setToast({
      message: `Reserva confirmada: ${sala.nombre}, Bloque ${bloque}`,
      type: "success",
      duration: 3000
    });
  };

  // CAMBIO IMPORTANTE: Lógica de cancelación con "Deshacer"
  const handleCancelarReserva = (id) => {
    // 1. Encontrar la reserva antes de borrarla
    const reservaEliminada = reservas.find((r) => r.id === id);
    
    if (!reservaEliminada) return;

    // 2. Borrarla inmediatamente
    setReservas((prev) => prev.filter((r) => r.id !== id));

    // 3. Mostrar Toast con opción de revertir
    setToast({
      message: "Reserva cancelada",
      type: "info",
      duration: 5000, // 5 segundos como pediste
      action: {
        label: "Revertir",
        onClick: () => {
          // Re-agregar la reserva eliminada
          setReservas((current) => [...current, reservaEliminada]);
          setToast(null); // Cerrar toast
        }
      }
    });
  };

  return (
    <div className="relative">
      {vistaActual === "home" && (
        <Home onNavigate={handleNavigate} reservas={reservas} />
      )}

      {vistaActual !== "home" && (
        <div className="min-h-screen bg-gray-100 pb-20">
          {vistaActual === "escanear" && (
            <EscanearQR
              onNavigate={handleNavigate}
              onSalaSeleccionada={handleSalaSeleccionada}
            />
          )}

          {vistaActual === "detalle" && (
            <DetalleSala
              sala={salaSeleccionada}
              reservas={reservas}
              onNavigate={handleNavigate}
              onReservar={handleReservar}
            />
          )}

          {vistaActual === "reservas" && (
            <MisReservas
              reservas={reservas}
              onNavigate={handleNavigate}
              onCancelar={handleCancelarReserva}
            />
          )}

          {vistaActual === "horarios" && (
            <HorarioSalas 
              reservas={reservas}
              onNavigate={handleNavigate}
              onReservar={handleReservar}
            />
          )}

          {vistaActual === "generador" && (
            <GeneradorQR onNavigate={handleNavigate} />
          )}
        </div>
      )}

      <BottomNav vistaActual={vistaActual} onNavigate={handleNavigate} />
      
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
          action={toast.action}
          duration={toast.duration}
        />
      )}
    </div>
  );
}
