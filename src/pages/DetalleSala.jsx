import React, { useState } from "react";
import Header from "../components/Header";
import Button from "../components/Button";
import Card from "../components/Card";
import ConfirmModal from "../components/ConfirmModal";
import Toast from "../components/Toast";
import { bloques } from "../data/mockData";
import { HiCalendar, HiBuildingOffice2, HiUsers, HiCheckCircle } from "react-icons/hi2";

export default function DetalleSala({ sala, onNavigate, onReservar }) {
  // Obtener fecha actual y fecha máxima (7 días desde hoy)
  const hoy = new Date();
  const maxFecha = new Date();
  maxFecha.setDate(maxFecha.getDate() + 7);

  // Estado para la fecha seleccionada (por defecto hoy)
  const [fechaSeleccionada, setFechaSeleccionada] = useState(
    hoy.toISOString().split('T')[0]
  );
  
  // Estado para el bloque seleccionado
  const [bloqueSeleccionado, setBloqueSeleccionado] = useState(null);
  
  // Estado para el modal de confirmación
  const [confirmacion, setConfirmacion] = useState(false);
  
  // Estado para toast
  const [toast, setToast] = useState(null);

  if (!sala) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header title="Detalle de Sala" onBack={() => onNavigate("home")} />
        <div className="max-w-sm mx-auto p-6 text-center">
          <p className="text-gray-600">No hay sala seleccionada</p>
        </div>
      </div>
    );
  }

  const handleSeleccionarBloque = (bloque) => {
    setBloqueSeleccionado(bloque);
  };

  const handleReservar = () => {
    setConfirmacion(true);
  };

  const confirmarReserva = () => {
    onReservar(sala, bloqueSeleccionado, fechaSeleccionada);
    setConfirmacion(false);
    setToast({
      type: "success",
      message: `Reserva confirmada: ${sala.nombre} - Bloque ${bloqueSeleccionado} - ${fechaSeleccionada}`
    });
    setTimeout(() => onNavigate("home"), 1500);
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      <Header
        title={`Sala ${sala.nombre}`}
        onBack={() => onNavigate("escanear")}
      />

      <div className="max-w-sm mx-auto p-6">
        {/* Información de la sala */}
        <Card className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Sala {sala.nombre}
          </h2>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex items-center">
              <HiBuildingOffice2 className="text-lg mr-2" />
              <span className="font-semibold mr-2">Edificio:</span>
              <span>{sala.edificio}</span>
            </div>
            <div className="flex items-center">
              <HiUsers className="text-lg mr-2" />
              <span className="font-semibold mr-2">Capacidad:</span>
              <span>{sala.capacidad} personas</span>
            </div>
          </div>
          
          {/* Etiquetas de la sala */}
          {sala.etiquetas && (
            <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-gray-200">
              {sala.etiquetas.map(etiq => (
                <span
                  key={etiq}
                  className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-200"
                >
                  {etiq}
                </span>
              ))}
            </div>
          )}
        </Card>

        {/* Selector de Fecha */}
        <Card className="mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <HiCalendar className="text-xl" /> Seleccionar Fecha
          </h3>
          <input
            type="date"
            value={fechaSeleccionada}
            onChange={(e) => setFechaSeleccionada(e.target.value)}
            min={hoy.toISOString().split('T')[0]}
            max={maxFecha.toISOString().split('T')[0]}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-base focus:outline-none focus:border-blue-500 transition-colors"
          />
          <p className="text-xs text-gray-500 mt-2">
            Puedes reservar hasta 7 días de anticipación
          </p>
        </Card>

        {/* Disponibilidad por bloques */}
        <div className="mb-3">
          <h3 className="text-lg font-bold text-gray-800 mb-3">
            Estado por bloque:
          </h3>
          <div className="grid grid-cols-4 gap-2">
            {bloques.map((bloque) => {
              const ocupado = sala.ocupados.includes(bloque);
              const seleccionado = bloqueSeleccionado === bloque;
              return (
                <button
                  key={bloque}
                  onClick={() => !ocupado && handleSeleccionarBloque(bloque)}
                  disabled={ocupado}
                  className={`
                    text-center py-3 rounded-lg text-xs font-semibold transition-all
                    ${ocupado
                      ? "bg-red-100 text-red-800 cursor-not-allowed"
                      : seleccionado
                        ? "bg-blue-600 text-white ring-2 ring-blue-400 shadow-lg scale-105"
                        : "bg-green-100 text-green-800 hover:bg-green-200 cursor-pointer hover:scale-105"
                    }
                  `}
                >
                  {bloque}
                </button>
              );
            })}
          </div>
          {bloqueSeleccionado && (
            <p className="text-xs text-blue-600 mt-2 font-medium flex items-center gap-1">
              <HiCheckCircle /> Bloque {bloqueSeleccionado} seleccionado
            </p>
          )}
        </div>

        {/* Botón de Reservar */}
        {bloqueSeleccionado && (
          <div className="mb-3">
            <Button
              onClick={handleReservar}
              variant="primary"
              className="w-full flex items-center justify-center gap-2"
            >
              <HiCheckCircle className="text-xl" /> Reservar Bloque {bloqueSeleccionado}
            </Button>
          </div>
        )}

        {/* Estadísticas */}
        <Card className="bg-gray-50">
          <div className="flex justify-around text-xs">
            <div className="text-center">
              <div className="font-semibold text-green-600">
                {bloques.filter(b => !sala.ocupados.includes(b)).length}
              </div>
              <div className="text-gray-600">Disponibles</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-red-600">
                {sala.ocupados.length}
              </div>
              <div className="text-gray-600">Ocupados</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-800">
                {bloques.length}
              </div>
              <div className="text-gray-600">Total</div>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Modal de confirmación */}
      {confirmacion && bloqueSeleccionado && (
        <ConfirmModal
          title="Confirmar Reserva"
          message={`¿Confirmar reserva de sala ${sala.nombre} para el bloque ${bloqueSeleccionado} el ${fechaSeleccionada}?`}
          onConfirm={confirmarReserva}
          onCancel={() => {
            setConfirmacion(false);
            setBloqueSeleccionado(null);
          }}
        />
      )}

      {/* Toast de notificación */}
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
