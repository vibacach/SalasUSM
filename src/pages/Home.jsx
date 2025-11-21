import React from "react";
import Card from "../components/Card";
import logoUSM from '../assets/Logo_USM.png';
import { HiCamera, HiCalendar, HiClipboardDocumentList, HiCheckCircle, HiClock, HiInboxArrowDown } from "react-icons/hi2";

export default function Home({ onNavigate, reservas }) {
  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      {/* Header con degradado */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-700 pt-6 pb-20 px-6">
        <div className="flex items-center mb-6">
          <img
            src={logoUSM}
            alt="Logo USM"
            className="w-12 h-auto mr-3"
          />
          <div>
            <h1 className="text-white font-bold text-2xl">QR Salas USM</h1>
            <p className="text-blue-100 text-sm">Dashboard</p>
          </div>
        </div>

        {/* Acceso Rápido - Ahora en la parte superior */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <button
            onClick={() => onNavigate("escanear")}
            className="bg-white/95 hover:bg-white text-blue-700 rounded-xl p-5 transition-all shadow-lg hover:shadow-xl"
            aria-label="Ir a escanear código QR de sala"
          >
            <HiCamera className="text-4xl mb-2 mx-auto" />
            <div className="text-sm font-bold">Escanear QR</div>
          </button>
          <button
            onClick={() => onNavigate("horarios")}
            className="bg-white/95 hover:bg-white text-purple-700 rounded-xl p-5 transition-all shadow-lg hover:shadow-xl"
            aria-label="Ver horarios de todas las salas"
          >
            <HiCalendar className="text-4xl mb-2 mx-auto" />
            <div className="text-sm font-bold">Ver Horarios</div>
          </button>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-sm mx-auto px-6 -mt-12">
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
              <p className="text-gray-600 text-sm mb-4">
                No tienes reservas pendientes
              </p>
              <button
                onClick={() => onNavigate("escanear")}
                className="text-blue-600 text-sm font-semibold hover:text-blue-700"
                aria-label="Ir a escanear sala para hacer primera reserva"
              >
                Hacer mi primera reserva →
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {reservas.slice(0, 3).map((reserva) => (
                <div
                  key={reserva.id}
                  className="bg-gray-50 rounded-lg p-3 border border-gray-200"
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

        {/* Estadísticas - Ahora en la parte inferior */}
        <div className="grid grid-cols-2 gap-3 mt-4 mb-4">
          <Card className="shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-700">{reservas.length}</div>
              <div className="text-sm text-blue-600 font-medium mt-1">Reservas Activas</div>
            </div>
          </Card>
          <Card className="shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-700">5</div>
              <div className="text-sm text-purple-600 font-medium mt-1">Salas Disponibles</div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}