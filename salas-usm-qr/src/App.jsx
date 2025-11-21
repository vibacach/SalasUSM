import React, { useState } from "react";
import Home from "./pages/Home";
import EscanearQR from "./pages/EscanearQR";
import DetalleSala from "./pages/DetalleSala";
import MisReservas from "./pages/MisReservas";
import HorarioSalas from "./pages/HorarioSalas";
import BottomNav from "./components/BottomNav";
import Toast from "./components/Toast";
import { reservasIniciales } from "./data/mockData";

export default function App() {
  // Estado de navegación
  const [vistaActual, setVistaActual] = useState("home");
  
  // Estado de datos
  const [salaSeleccionada, setSalaSeleccionada] = useState(null);
  const [reservas, setReservas] = useState(reservasIniciales);
  
  // Estado para Toast
  const [toast, setToast] = useState(null);

  // Función de navegación
  const handleNavigate = (vista) => {
    setVistaActual(vista);
  };

  // Función para seleccionar sala
  const handleSalaSeleccionada = (sala) => {
    setSalaSeleccionada(sala);
  };

  // Función para realizar una reserva
  const handleReservar = (sala, bloque, fecha) => {
    const nuevaReserva = {
      id: Date.now(),
      sala: sala.nombre,
      bloque: bloque,
      fecha: fecha ? new Date(fecha + 'T00:00:00').toLocaleDateString("es-CL") : new Date().toLocaleDateString("es-CL"),
      usuario: "Usuario Demo",
    };
    setReservas([...reservas, nuevaReserva]);
    setToast({
      message: `Reserva confirmada: Sala ${sala.nombre}, Bloque ${bloque}`,
      type: "success"
    });
  };

  // Función para cancelar una reserva
  const handleCancelarReserva = (id) => {
    setReservas(reservas.filter((r) => r.id !== id));
    setToast({
      message: "Reserva cancelada exitosamente",
      type: "info"
    });
  };

  // Renderizado condicional de vistas
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
              onNavigate={handleNavigate}
              onReservar={handleReservar}
            />
          )}
        </div>
      )}

      {/* Barra de navegación inferior en todas las vistas */}
      <BottomNav vistaActual={vistaActual} onNavigate={handleNavigate} />
      
      {/* Toast para notificaciones */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}