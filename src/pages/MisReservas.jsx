import React, { useState } from "react";
import Header from "../components/Header";
import Button from "../components/Button";
import Card from "../components/Card";
import ConfirmModal from "../components/ConfirmModal";
import { salas } from "../data/mockData";
import { HiClock, HiCalendar, HiUser, HiCheckCircle, HiShare, HiXMark, HiUsers } from "react-icons/hi2";

export default function MisReservas({ reservas, onNavigate, onCancelar }) {
  const [reservaACancelar, setReservaACancelar] = useState(null);
  const [mostrarCompartir, setMostrarCompartir] = useState(null);

  const compartirReserva = (reserva) => {
    const texto = `📋 Reserva de Sala - QR Salas USM\n\n` +
                  `🏢 Sala: ${reserva.sala}\n` +
                  `🕐 Bloque: ${reserva.bloque}\n` +
                  `📅 Fecha: ${reserva.fecha}\n` +
                  `👤 Usuario: ${reserva.usuario}\n\n` +
                  `✅ Reserva confirmada`;
    
    return texto;
  };

  const handleCompartir = (reserva, medio) => {
    const texto = compartirReserva(reserva);
    const textoEncoded = encodeURIComponent(texto);
    
    switch(medio) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${textoEncoded}`, '_blank');
        break;
      case 'copiar':
        navigator.clipboard.writeText(texto);
        alert('Reserva copiada al portapapeles');
        break;
      case 'outlook':
        window.open(`mailto:?subject=Reserva Sala ${reserva.sala}&body=${textoEncoded}`, '_blank');
        break;
      default:
        break;
    }
    setMostrarCompartir(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      <Header title="Mis Reservas" onBack={() => onNavigate("home")} />

      <div className="max-w-sm mx-auto p-6">
        {reservas.length === 0 ? (
          <div className="text-center mt-20">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-5xl">📋</span>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              No tienes reservas
            </h2>
            <p className="text-gray-600 mb-6">
              Escanea una sala para hacer tu primera reserva
            </p>
            <Button
              onClick={() => onNavigate("escanear")}
              variant="primary"
            >
              Escanear Sala
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <h2 className="text-lg font-bold text-gray-800">
                Tienes {reservas.length} reserva{reservas.length !== 1 ? "s" : ""}
              </h2>
              <p className="text-sm text-gray-600">
                Gestiona tus reservas activas
              </p>
            </div>

            <div className="space-y-3">
              {reservas.map((reserva) => {
                // Buscar información de la sala
                const infoSala = salas.find(s => s.nombre === reserva.sala);
                
                return (
                <Card key={reserva.id} className="hover:shadow-lg transition-shadow p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-bold text-gray-800">
                      Sala {reserva.sala}
                    </h3>
                    <span className="inline-block px-2 py-0.5 bg-green-100 text-green-800 text-xs font-semibold rounded-full flex items-center gap-1">
                      <HiCheckCircle /> Activa
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-sm text-gray-600 mb-3">
                    <div className="flex items-center">
                      <HiClock className="mr-1.5 text-base" />
                      <span>Bloque {reserva.bloque}</span>
                    </div>
                    <div className="flex items-center">
                      <HiCalendar className="mr-1.5 text-base" />
                      <span>{reserva.fecha}</span>
                    </div>
                    <div className="flex items-center">
                      <HiUser className="mr-1.5 text-base" />
                      <span>{reserva.usuario}</span>
                    </div>
                    {infoSala && (
                      <div className="flex items-center">
                        <HiUsers className="mr-1.5 text-base" />
                        <span>{infoSala.capacidad} personas</span>
                      </div>
                    )}
                  </div>

                  {/* Botones en un solo contenedor horizontal */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setReservaACancelar(reserva)}
                      variant="danger"
                      size="small"
                      className="flex-1 py-2 text-sm"
                    >
                      Cancelar Reserva
                    </Button>
                    
                    <button
                      onClick={() => setMostrarCompartir(reserva)}
                      className="px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
                      aria-label="Compartir reserva"
                    >
                      <HiShare className="text-lg" />
                    </button>
                  </div>
                </Card>
                );
              })}
            </div>

            <div className="mt-6">
              <Button
                onClick={() => onNavigate("escanear")}
                variant="primary"
                className="w-full"
              >
                + Nueva Reserva
              </Button>
            </div>
          </>
        )}
      </div>
      
      {/* Modal de confirmación para cancelar */}
      {reservaACancelar && (
        <ConfirmModal
          title="Cancelar Reserva"
          message={`¿Estás seguro de cancelar la reserva de la sala ${reservaACancelar.sala} para el bloque ${reservaACancelar.bloque}?`}
          onConfirm={() => {
            onCancelar(reservaACancelar.id);
            setReservaACancelar(null);
          }}
          onCancel={() => setReservaACancelar(null)}
        />
      )}

      {/* Modal de compartir */}
      {mostrarCompartir && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full animate-scale-in">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  Compartir Reserva
                </h3>
                <button
                  onClick={() => setMostrarCompartir(null)}
                  className="text-gray-400 hover:text-gray-600"
                  aria-label="Cerrar"
                >
                  <HiXMark className="text-2xl" />
                </button>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                Sala {mostrarCompartir.sala} - Bloque {mostrarCompartir.bloque}
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => handleCompartir(mostrarCompartir, 'whatsapp')}
                  className="w-full flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl transition-colors"
                >
                  <div className="text-2xl">💬</div>
                  <div className="text-left">
                    <div className="font-semibold">WhatsApp</div>
                    <div className="text-xs opacity-75">Compartir por WhatsApp</div>
                  </div>
                </button>

                <button
                  onClick={() => handleCompartir(mostrarCompartir, 'copiar')}
                  className="w-full flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl transition-colors"
                >
                  <div className="text-2xl">📋</div>
                  <div className="text-left">
                    <div className="font-semibold">Copiar texto</div>
                    <div className="text-xs opacity-75">Copiar al portapapeles</div>
                  </div>
                </button>

                <button
                  onClick={() => handleCompartir(mostrarCompartir, 'outlook')}
                  className="w-full flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl transition-colors"
                >
                  <div className="text-2xl">📧</div>
                  <div className="text-left">
                    <div className="font-semibold">Outlook</div>
                    <div className="text-xs opacity-75">Enviar por correo</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
