import React, { useState } from "react";
import Card from "../components/Card";
import logoUSM from '../assets/Logo_USM.png';
import fondoUSM from '../assets/usm-CC.jpeg';
import { HiCamera, HiCalendar, HiClipboardDocumentList, HiCheckCircle, HiClock, HiInboxArrowDown, HiXMark, HiShare } from "react-icons/hi2";
import { salas } from "../data/mockData"; // Necesitamos esto para buscar info extra de la sala si hiciera falta

export default function Home({ onNavigate, reservas }) {
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);
  const [mostrarCompartir, setMostrarCompartir] = useState(null);

  // --- Lógica de Compartir (Reutilizada y adaptada) ---
  const generarTextoReserva = (reserva) => {
    return `📋 Reserva de Sala - QR Salas USM\n\n` +
           `🏢 Sala: ${reserva.sala}\n` +
           `🕐 Bloque: ${reserva.bloque}\n` +
           `📅 Fecha: ${reserva.fecha}\n` +
           `👤 Usuario: ${reserva.usuario}\n\n` +
           `✅ Reserva confirmada`;
  };

  const handleBotonCompartir = async (reserva) => {
    const textoCompartir = generarTextoReserva(reserva);
    
    const shareData = {
      title: 'Reserva Sala USM',
      text: textoCompartir,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Error al compartir nativo:", err);
      }
    } else {
      setMostrarCompartir(reserva);
      setReservaSeleccionada(null); // Cerramos el detalle para mostrar el menú de compartir limpio
    }
  };

  const handleOpcionCompartir = (reserva, medio) => {
    const texto = generarTextoReserva(reserva);
    const textoEncoded = encodeURIComponent(texto);
    
    switch(medio) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${textoEncoded}`, '_blank');
        break;
      case 'copiar':
        navigator.clipboard.writeText(texto);
        // Aquí podrías poner un toast si quisieras, pero por simplicidad en home lo dejamos así o pasas la prop
        alert("Copiado al portapapeles");
        break;
      case 'outlook':
        window.open(`mailto:?subject=Reserva Sala ${reserva.sala}&body=${textoEncoded}`, '_blank');
        break;
      default: break;
    }
    setMostrarCompartir(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      {/* Header con degradado e imagen */}
      <div className="relative bg-gradient-to-br from-blue-600 to-purple-700 pt-6 pb-24 px-6 overflow-hidden">
        
        {/* Imagen de fondo */}
        <img
          src={fondoUSM}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
        />

        {/* Contenido del header */}
        <div className="flex items-center mb-6 relative">
          <img src={logoUSM} className="w-12 h-auto mr-3" />
          <div>
            <h1 className="text-white font-bold text-2xl">QR | Salas USM</h1>
            <p className="text-blue-100 text-sm">Dashboard</p>
          </div>
        </div>

        {/* Acceso rápido */}
        <div className="grid grid-cols-2 gap-3 mt-6 relative">
          <button
            onClick={() => onNavigate("escanear")}
            className="bg-white text-blue-700 rounded-xl p-5 shadow-lg hover:bg-gray-50 transition-colors active:scale-95"
          >
            <HiCamera className="text-4xl mb-2 mx-auto" />
            <div className="text-sm font-bold">Escanear QR</div>
          </button>

          <button
            onClick={() => onNavigate("horarios")}
            className="bg-white text-purple-700 rounded-xl p-5 shadow-lg hover:bg-gray-50 transition-colors active:scale-95"
          >
            <HiCalendar className="text-4xl mb-2 mx-auto" />
            <div className="text-sm font-bold">Ver Horarios</div>
          </button>
        </div>
      </div>

      {/* Contenido principal con card flotante */}
      <div className="max-w-sm mx-auto px-6 -mt-16 relative z-20">
        
        {/* Próximas Reservas */}
        <Card className="mb-4 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <HiClipboardDocumentList className="text-xl" /> Próximas Reservas
            </h2>
            {reservas.length > 0 && (
              <button
                onClick={() => onNavigate("reservas")}
                className="text-blue-600 text-sm font-medium hover:text-blue-700"
              >
                Ver todas
              </button>
            )}
          </div>

          {reservas.length === 0 ? (
            <div className="text-center py-8">
              <HiInboxArrowDown className="text-6xl mb-3 mx-auto text-gray-400" />
              <p className="text-gray-600 text-sm mb-4">No tienes reservas pendientes</p>
              <button
                onClick={() => onNavigate("escanear")}
                className="text-blue-600 text-sm font-semibold hover:text-blue-700"
              >
                Hacer mi primera reserva →
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {reservas.slice(0, 3).map((reserva) => (
                <div
                  key={reserva.id}
                  onClick={() => setReservaSeleccionada(reserva)} // Al hacer clic, abrimos el detalle
                  className="bg-gray-50 rounded-lg p-3 border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors active:scale-95"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-gray-800">
                      Sala {reserva.sala}
                    </span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center gap-1">
                      <HiCheckCircle className="text-sm" /> Activa
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <HiClock className="text-base" /> Bloque {reserva.bloque}
                    </div>
                    <div className="flex items-center gap-1">
                      <HiCalendar className="text-base" /> {reserva.fecha}
                    </div>
                  </div>
                </div>
              ))}

              {reservas.length > 3 && (
                <p className="text-center text-sm text-gray-500 pt-2">
                  +{reservas.length - 3} reserva(s) más
                </p>
              )}
            </div>
          )}
        </Card>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 gap-3 mt-4 mb-4">
          <Card className="shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-700">{reservas.length}</div>
              <div className="text-sm text-blue-600 font-medium mt-1">Reservas Activas</div>
            </div>
          </Card>

          <Card className="shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-700">{salas.length}</div>
              <div className="text-sm text-purple-600 font-medium mt-1">Salas Totales</div>
            </div>
          </Card>
        </div>

        {/* Botón Admin Temporal */}
        <div className="mt-8 text-center pb-8">
          <button 
            onClick={() => onNavigate("generador")}
            className="text-xs text-gray-400 underline hover:text-gray-600 p-2"
          >
            Administrador: Generar QRs para imprimir
          </button>
        </div>
      </div>

      {/* --- MODAL DETALLE DE RESERVA (Home) --- */}
      {reservaSeleccionada && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xs animate-scale-in overflow-hidden">
            
            {/* Header Modal */}
            <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
              <h3 className="font-bold text-lg">Detalle Reserva</h3>
              <button onClick={() => setReservaSeleccionada(null)} className="hover:bg-blue-700 rounded-full p-1">
                <HiXMark className="text-2xl" />
              </button>
            </div>

            {/* Contenido Modal */}
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="text-sm text-gray-500 mb-1">Sala Reservada</div>
                <div className="text-3xl font-bold text-gray-800">{reservaSeleccionada.sala}</div>
                <div className="inline-block bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full mt-2">
                  Confirmada
                </div>
              </div>

              <div className="space-y-3 text-sm text-gray-600 bg-gray-50 p-4 rounded-xl mb-6">
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span>Fecha:</span>
                  <span className="font-semibold text-gray-800">{reservaSeleccionada.fecha}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span>Bloque:</span>
                  <span className="font-semibold text-gray-800">{reservaSeleccionada.bloque}</span>
                </div>
                <div className="flex justify-between">
                  <span>Usuario:</span>
                  <span className="font-semibold text-gray-800">{reservaSeleccionada.usuario}</span>
                </div>
              </div>

              <button 
                onClick={() => handleBotonCompartir(reservaSeleccionada)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors active:scale-95"
              >
                <HiShare className="text-xl" /> Compartir Reserva
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MENÚ COMPARTIR FALLBACK (Desktop) --- */}
      {mostrarCompartir && (
        <div className="fixed inset-0 z-[60] flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/50 transition-opacity" onClick={() => setMostrarCompartir(null)}></div>
          
          <div className="relative bg-white rounded-t-2xl shadow-2xl p-6 pb-10 animate-slide-up max-h-[90vh] overflow-y-auto">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6"></div>
            
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Compartir Reserva</h3>
                <p className="text-sm text-gray-500">
                  {mostrarCompartir.sala} - {mostrarCompartir.bloque}
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
