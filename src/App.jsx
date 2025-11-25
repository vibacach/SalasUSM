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

  // --- PERSISTENCIA LOCAL (Local Storage) ---
  // 1. Inicialización: Leemos del navegador o usamos los datos de ejemplo
  const [reservas, setReservas] = useState(() => {
    const reservasGuardadas = localStorage.getItem("reservasUSM");
    return reservasGuardadas ? JSON.parse(reservasGuardadas) : reservasIniciales;
  });

  // 2. Efecto: Cada vez que 'reservas' cambia, guardamos en el navegador
  useEffect(() => {
    localStorage.setItem("reservasUSM", JSON.stringify(reservas));
  }, [reservas]);
  // ------------------------------------------

  // Función de navegación
  const handleNavigate = (vista) => {
    setVistaActual(vista);
  };

  // Función para seleccionar sala
  const handleSalaSeleccionada = (sala) => {
    setSalaSeleccionada(sala);
  };

  // Función para realizar una reserva (CON UNDO)
  const handleReservar = (sala, bloque, fecha) => {
    // Aseguramos el formato DD/MM/YYYY
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

    // 1. Agregamos la reserva inmediatamente
    setReservas((prev) => [...prev, nuevaReserva]);

    // 2. Mostramos Toast con opción de REVERTIR
    setToast({
      message: `Reserva realizada: ${sala.nombre} - ${bloque}`,
      type: "success",
      duration: 5000,
      action: {
        label: "Revertir",
        onClick: () => {
          // Eliminar la reserva recién creada
          setReservas((prev) => prev.filter((r) => r.id !== nuevaReserva.id));
          setToast({
            message: "Reserva revertida correctamente",
            type: "info",
            duration: 3000
          });
        }
      }
    });
  };

  // Función para cancelar una reserva (CON UNDO)
  const handleCancelarReserva = (id) => {
    const reservaEliminada = reservas.find((r) => r.id === id);
    if (!reservaEliminada) return;

    setReservas((prev) => prev.filter((r) => r.id !== id));

    setToast({
      message: "Reserva cancelada",
      type: "info",
      duration: 5000,
      action: {
        label: "Deshacer",
        onClick: () => {
          setReservas((current) => [...current, reservaEliminada]);
          setToast(null);
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
