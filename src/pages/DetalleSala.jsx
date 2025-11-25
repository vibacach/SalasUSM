import React, { useState } from "react";
import Header from "../components/Header";
import Button from "../components/Button";
import Card from "../components/Card";
// ConfirmModal y Toast ya no son necesarios aquí
import { bloques } from "../data/mockData";
import { HiCalendar, HiBuildingOffice2, HiUsers, HiCheckCircle } from "react-icons/hi2";

export default function DetalleSala({ sala, reservas, onNavigate, onReservar }) {
  const hoy = new Date();
  const maxFecha = new Date();
  maxFecha.setDate(maxFecha.getDate() + 7);

  const [fechaSeleccionada, setFechaSeleccionada] = useState(
    hoy.toISOString().split('T')[0]
  );
  
  const [bloqueSeleccionado, setBloqueSeleccionado] = useState(null);

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

  // ACCIÓN INMEDIATA
  const handleReservarInmediato = () => {
    // 1. Ejecutar la reserva (App.jsx mostrará el Toast global con "Revertir")
    onReservar(sala, bloqueSeleccionado, fechaSeleccionada);
    
    // 2. Redirigir inmediatamente
    onNavigate("home");
  };

  const verificarOcupacion = (bloque) => {
    if (sala.ocupados.includes(bloque)) return true;

    const [anio, mes, dia] = fechaSeleccionada.split('-');
    const fechaComparar = `${dia}/${mes}/${anio}`;

    return reservas.some(r => 
      r.sala === sala.nombre && 
      r.bloque === bloque && 
      r.fecha === fechaComparar
    );
  };

  const bloquesOcupadosCount = bloques.filter(b => verificarOcupacion(b)).length;
  const bloquesDisponiblesCount = bloques.length - bloquesOcupadosCount;

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      <Header
        title={`Sala ${sala.nombre}`}
        onBack={() => onNavigate("escanear")}
      />

      <div className="max-w-sm mx-auto p-6">
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

        <Card className="mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <HiCalendar className="text-xl" /> Seleccionar Fecha
          </h3>
          <input
            type="date"
            value={fechaSeleccionada}
            onChange={(e) => {
              setFechaSeleccionada(e.target.value);
              setBloqueSeleccionado(null);
            }}
            min={hoy.toISOString().split('T')[0]}
            max={maxFecha.toISOString().split('T')[0]}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-base focus:outline-none focus:border-blue-500 transition-colors"
          />
          <p className="text-xs text-gray-500 mt-2">
            Puedes reservar hasta 7 días de anticipación
          </p>
        </Card>

        <div className="mb-3">
          <h3 className="text-lg font-bold text-gray-800 mb-3">
            Estado por bloque:
          </h3>
          <div className="grid grid-cols-4 gap-2">
            {bloques.map((bloque) => {
              const ocupado = verificarOcupacion(bloque);
              const seleccionado = bloqueSeleccionado === bloque;
              return (
                <button
                  key={bloque}
                  onClick={() => !ocupado && handleSeleccionarBloque(bloque)}
                  disabled={ocupado}
                  className={`
                    text-center py-3 rounded-lg text-xs font-semibold transition-all relative
                    ${ocupado
                      ? "bg-red-100 text-red-800 cursor-not-allowed border border-red-200"
                      : seleccionado
                        ? "bg-blue-600 text-white ring-2 ring-blue-400 shadow-lg scale-105"
                        : "bg-green-100 text-green-800 hover:bg-green-200 cursor-pointer hover:scale-105 border border-green-200"
                    }
                  `}
                >
                  {bloque}
                  {ocupado && <span className="absolute bottom-0.5 left-0 w-full text-[9px] opacity-70">Ocup</span>}
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

        {bloqueSeleccionado && (
          <div className="mb-3">
            <Button
              onClick={handleReservarInmediato} // Acción directa
              variant="primary"
              className="w-full flex items-center justify-center gap-2"
            >
              <HiCheckCircle className="text-xl" /> Reservar Bloque {bloqueSeleccionado}
            </Button>
          </div>
        )}

        <Card className="bg-gray-50">
          <div className="flex justify-around text-xs">
            <div className="text-center">
              <div className="font-bold text-lg text-green-600">
                {bloquesDisponiblesCount}
              </div>
              <div className="text-gray-600 font-medium">Disponibles</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg text-red-600">
                {bloquesOcupadosCount}
              </div>
              <div className="text-gray-600 font-medium">Ocupados</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg text-gray-800">
                {bloques.length}
              </div>
              <div className="text-gray-600 font-medium">Total</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
