import React, { useState } from "react";
import Header from "../components/Header";
import Button from "../components/Button";
import Card from "../components/Card";
import { salas } from "../data/mockData";
import { HiClock, HiCalendar, HiUser, HiCheckCircle, HiShare, HiXMark, HiUsers } from "react-icons/hi2";

export default function MisReservas({ reservas, onNavigate, onCancelar }) {
  const [mostrarCompartir, setMostrarCompartir] = useState(null);

  // Generador de texto para compartir
  const generarTextoReserva = (reserva) => {
    return `📋 Reserva de Sala - QR Salas USM\n\n` +
           `🏢 Sala: ${reserva.sala}\n` +
           `🕐 Bloque: ${reserva.bloque}\n` +
           `📅 Fecha: ${reserva.fecha}\n` +
           `👤 Usuario: ${reserva.usuario}\n\n` +
           `✅ Reserva confirmada`;
  };

  // Lógica Híbrida: Intenta Nativo -> Cae a Personalizado
  const handleBotonCompartir = async (reserva) => {
    const textoCompartir = generarTextoReserva(reserva);
    
    const shareData = {
      title: 'Reserva Sala USM',
      text: textoCompartir,
      // url: window.location.href // ELIMINADO: Ya no compartimos la URL
    };

    // 1. Intentar usar la API Nativa del navegador (Móviles)
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        console.log("Compartido exitosamente vía nativa");
      } catch (err) {
        // Si el usuario cancela o hay error, no hacemos nada o mostramos log
        console.log("Error o cancelación al compartir:", err);
      }
    } else {
      // 2. Si no soporta nativo (Desktop), mostramos nuestro menú personalizado
      setMostrarCompartir(reserva);
    }
  };

  // Manejadores para el menú personalizado (Fallback)
  const handleOpcionCompartir = (reserva, medio) => {
    const texto = generarTextoReserva(reserva);
    const textoEncoded = encodeURIComponent(texto);
    
    switch(medio) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${textoEncoded}`, '_blank');
        break;
      case 'copiar':
        navigator.clipboard.writeText(texto);
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

                  <div className="flex gap-2">
                    <Button
                      onClick={() => onCancelar(reserva.id)}
                      variant="danger"
                      size="small"
                      className="flex-1 py-2 text-sm"
                    >
                      Cancelar
                    </Button>
                    
                    {/* Botón Compartir Actualizado */}
                    <button
                      onClick={() => handleBotonCompartir(reserva)}
                      className="px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors active:scale-95"
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

      {/* Menú Inferior de Compartir (Fallback para Desktop) */}
      {mostrarCompartir && (
        <div className="fixed inset-0 z-[60] flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/50 transition-opacity" onClick={() => setMostrarCompartir(null)}></div>
          
          <div className="relative bg-white rounded-t-2xl shadow-2xl p-6 pb-10 animate-slide-up max-h-[90vh] overflow-y-auto">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6"></div>
            
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Compartir Reserva</h3>
                <p className="text-sm text-gray-500">
                  {mostrarCompartir.sala} - Bloque {mostrarCompartir.bloque}
                </p>
              </div>
              <button onClick={() => setMostrarCompartir(null)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-gray-600 transition-colors">
                <HiXMark className="text-xl" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <button onClick={() => handleOpcionCompartir(mostrarCompartir, 'whatsapp')} className="flex flex-row items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors active:scale-95">
                <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xl">💬</div>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-semibold text-gray-700">WhatsApp</span>
                  <span className="text-xs text-gray-500">Enviar mensaje</span>
                </div>
              </button>

              <button onClick={() => handleOpcionCompartir(mostrarCompartir, 'outlook')} className="flex flex-row items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors active:scale-95">
                <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xl">📧</div>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-semibold text-gray-700">Outlook</span>
                  <span className="text-xs text-gray-500">Enviar correo</span>
                </div>
              </button>

              <button onClick={() => handleOpcionCompartir(mostrarCompartir, 'copiar')} className="flex flex-row items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors active:scale-95">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl">📋</div>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-semibold text-gray-700">Copiar</span>
                  <span className="text-xs text-gray-500">Copiar al portapapeles</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
