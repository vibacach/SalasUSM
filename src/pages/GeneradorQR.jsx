import React from "react";
import QRCode from "react-qr-code";
import Header from "../components/Header";
import Card from "../components/Card";
import { salas } from "../data/mockData";
import { HiPrinter } from "react-icons/hi2";

export default function GeneradorQR({ onNavigate }) {
  
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      <Header title="Códigos QR de Salas" onBack={() => onNavigate("home")} />

      <div className="max-w-md mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600 text-sm">
            Estos códigos deben ser pegados en la entrada de cada sala.
          </p>
          <button 
            onClick={handlePrint}
            className="p-2 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
            title="Imprimir"
          >
            <HiPrinter className="text-xl" />
          </button>
        </div>

        <div className="space-y-6">
          {salas.map((sala) => (
            <Card key={sala.id} className="flex flex-col items-center p-6 border-2 border-dashed border-gray-300">
              <h3 className="text-xl font-bold text-gray-800 mb-1">Sala {sala.nombre}</h3>
              <p className="text-sm text-gray-500 mb-4">{sala.edificio}</p>
              
              <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-100">
                <QRCode 
                  value={JSON.stringify({ id: sala.id, nombre: sala.nombre })} 
                  size={150}
                  level="H"
                />
              </div>
              
              <p className="mt-4 text-xs font-mono text-gray-400">
                ID: {sala.id}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
