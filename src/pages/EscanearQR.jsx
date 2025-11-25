import React, { useState } from "react";
import { Scanner } from '@yudiel/react-qr-scanner';
import Header from "../components/Header";
import Button from "../components/Button";
import { salas } from "../data/mockData";
import { HiCamera, HiLightBulb, HiArrowRight, HiXCircle } from "react-icons/hi2";

export default function EscanearQR({ onNavigate, onSalaSeleccionada }) {
  const [errorScan, setErrorScan] = useState(null);
  const [modoCamara, setModoCamara] = useState(true);

  const handleScan = (rawValue) => {
    if (rawValue) {
      try {
        const data = JSON.parse(rawValue);
        const salaEncontrada = salas.find((s) => s.id === data.id);

        if (salaEncontrada) {
          onSalaSeleccionada(salaEncontrada);
          onNavigate("detalle");
        } else {
          setErrorScan("QR no reconocido. Intente con un código válido.");
        }
      } catch (e) {
        setErrorScan("Formato inválido. Use un QR generado por la app.");
      }
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  const handleSimulacion = (sala) => {
    onSalaSeleccionada(sala);
    onNavigate("detalle");
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      <Header title="Escanear Sala" onBack={() => onNavigate("home")} />

      <div className="max-w-sm mx-auto p-4">
        <div className="flex justify-center mb-4 bg-white rounded-lg p-1 shadow-sm">
          <button 
            onClick={() => setModoCamara(true)}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${modoCamara ? 'bg-blue-600 text-white shadow' : 'text-gray-500'}`}
          >
            Usar Cámara
          </button>
          <button 
            onClick={() => setModoCamara(false)}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${!modoCamara ? 'bg-blue-600 text-white shadow' : 'text-gray-500'}`}
          >
            Simular
          </button>
        </div>

        {modoCamara && (
          <div className="bg-black rounded-2xl overflow-hidden shadow-lg relative aspect-square mb-6 border-4 border-white">
            <Scanner
              onScan={(result) => {
                if (result && result.length > 0) handleScan(result[0].rawValue);
              }}
              onError={handleError}
              components={{ audio: false, finderea: false }}
              styles={{ container: { width: '100%', height: '100%' } }}
            />
            <div className="absolute inset-0 border-2 border-white/30 m-8 rounded-lg pointer-events-none flex items-center justify-center">
              <div className="w-full h-0.5 bg-red-500/80 animate-pulse"></div>
            </div>
            {errorScan && (
              <div className="absolute bottom-4 left-4 right-4 bg-red-600/90 text-white text-xs p-3 rounded-lg text-center flex items-center justify-center gap-2 backdrop-blur-sm">
                <HiXCircle className="text-lg flex-shrink-0" />
                <span>{errorScan}</span>
              </div>
            )}
          </div>
        )}

        {!modoCamara && (
          <div className="text-center mb-6 animate-scale-in">
             <div className="w-32 h-32 mx-auto mb-4 bg-white rounded-lg shadow-md flex items-center justify-center">
              <HiCamera className="text-7xl text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Simulación</h2>
            <div className="space-y-3 mt-4">
              {salas.map((sala) => (
                <Button
                  key={sala.id}
                  onClick={() => handleSimulacion(sala)}
                  variant="secondary"
                  className="w-full text-left flex items-center justify-between"
                  size="small"
                >
                  <span>Sala {sala.nombre}</span>
                  <HiArrowRight />
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800 flex items-start gap-2">
            <HiLightBulb className="text-lg flex-shrink-0 mt-0.5" />
            <span>
              <strong>Tip:</strong> Ve al menú "Administrador" en el Inicio para imprimir los QRs.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
