import React, { useState } from "react";
import Header from "../components/Header";
import Card from "../components/Card";
import Button from "../components/Button";
import ConfirmModal from "../components/ConfirmModal";
import Toast from "../components/Toast";
import { salas, bloques, etiquetasEquipamiento, etiquetasEdificio } from "../data/mockData";
import { HiUsers, HiChartBar, HiCheckCircle, HiMagnifyingGlass, HiXMark, HiShare, HiAdjustmentsHorizontal, HiChevronDown, HiChevronUp, HiBuildingOffice2, HiCalendar } from "react-icons/hi2";

export default function HorarioSalas({ reservas, onNavigate, onReservar }) {
  const [salaExpandida, setSalaExpandida] = useState(null);
  const [bloqueSeleccionado, setBloqueSeleccionado] = useState(null);
  const [salaSeleccionada, setSalaSeleccionada] = useState(null);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [busquedaTexto, setBusquedaTexto] = useState("");
  const [etiquetasSeleccionadas, setEtiquetasSeleccionadas] = useState([]);
  const [mostrarCompartir, setMostrarCompartir] = useState(null);
  const [mostrarFiltroEquipamiento, setMostrarFiltroEquipamiento] = useState(false);
  const [mostrarFiltroEdificio, setMostrarFiltroEdificio] = useState(false);
  const [toast, setToast] = useState(null);

  const hoy = new Date();
  const maxFecha = new Date();
  maxFecha.setDate(hoy.getDate() + 7);

  const [fechaSeleccionada, setFechaSeleccionada] = useState(
    hoy.toISOString().split('T')[0]
  );

  // --- Lógica de Filtros ---
  const toggleEtiqueta = (etiqueta) => {
    if (etiquetasSeleccionadas.includes(etiqueta)) {
      setEtiquetasSeleccionadas(etiquetasSeleccionadas.filter(e => e !== etiqueta));
    } else {
      setEtiquetasSeleccionadas([...etiquetasSeleccionadas, etiqueta]);
    }
  };

  const limpiarFiltros = () => {
    setBusquedaTexto("");
    setEtiquetasSeleccionadas([]);
  };

  const salasFiltradas = salas.filter(sala => {
    const coincideTexto = sala.nombre.toLowerCase().includes(busquedaTexto.toLowerCase()) ||
                          sala.edificio.toLowerCase().includes(busquedaTexto.toLowerCase());
    const coincideEtiquetas = etiquetasSeleccionadas.length === 0 ||
                              etiquetasSeleccionadas.every(etiq => sala.etiquetas.includes(etiq));
    return coincideTexto && coincideEtiquetas;
  });

  // --- Lógica de Verificación de Ocupación (MOVIDA ARRIBA) ---
  // La necesitamos aquí para que generarTextoHorario pueda usarla
  const verificarOcupacion = (sala, bloque) => {
    // 1. Estático (Base de datos fija)
    if (sala.ocupados.includes(bloque)) return true;

    // 2. Dinámico (Reservas realizadas en la app)
    const [anio, mes, dia] = fechaSeleccionada.split('-');
    const fechaComparar = `${dia}/${mes}/${anio}`;

    return reservas.some(r => 
      r.sala === sala.nombre && 
      r.bloque === bloque && 
      r.fecha === fechaComparar
    );
  };

  // --- Generador de Texto para Compartir (ACTUALIZADO) ---
  const generarTextoHorario = (sala) => {
    // Calculamos bloques disponibles reales para la fecha seleccionada
    const bloquesDisponibles = bloques.filter(b => !verificarOcupacion(sala, b));
    
    // Formateamos la fecha para que sea legible
    const [year, month, day] = fechaSeleccionada.split('-');
    const fechaFormateada = `${day}/${month}/${year}`;

    return `📅 Horario Sala ${sala.nombre} - ${sala.edificio}\n` +
           `📝 Descripción: ${sala.equipamiento}\n` +
           `📆 Fecha: ${fechaFormateada}\n` +
           `✅ Bloques disponibles: ${bloquesDisponibles.join(', ') || 'Ninguno'}`;
  };

  // --- Manejadores de Compartir ---
  const handleBotonCompartir = async (sala) => {
    const textoCompartir = generarTextoHorario(sala);
    
    const shareData = {
      title: `Horario ${sala.nombre}`,
      text: textoCompartir,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log(err);
      }
    } else {
      setMostrarCompartir(sala);
    }
  };

  const handleOpcionCompartir = (sala, medio) => {
    const texto = generarTextoHorario(sala);
    const textoEncoded = encodeURIComponent(texto);
    
    switch(medio) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${textoEncoded}`, '_blank');
        break;
      case 'copiar':
        navigator.clipboard.writeText(texto);
        setToast({ type: "success", message: "Horario copiado" });
        break;
      case 'outlook':
        window.open(`mailto:?subject=Horario Sala ${sala.nombre}&body=${textoEncoded}`, '_blank');
        break;
      default: break;
    }
    setMostrarCompartir(null);
  };

  // --- Manejadores de Interacción ---
  const toggleSala = (salaId) => {
    setSalaExpandida(salaExpandida === salaId ? null : salaId);
    setBloqueSeleccionado(null); 
  };

  const handleSeleccionarBloque = (sala, bloque) => {
    setSalaSeleccionada(sala);
    setBloqueSeleccionado(bloque);
  };

  const handleReservar = () => {
    setMostrarConfirmacion(true);
  };

  const confirmarReserva = () => {
    onReservar(salaSeleccionada, bloqueSeleccionado, fechaSeleccionada);
    setMostrarConfirmacion(false);
    setToast({
      type: "success",
      message: `Reserva confirmada: ${salaSeleccionada.nombre} - Bloque ${bloqueSeleccionado}`
    });
    setBloqueSeleccionado(null);
    setSalaSeleccionada(null);
    setTimeout(() => onNavigate("home"), 1500);
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      <Header title="Horario de Salas" onBack={() => onNavigate("home")} />

      <div className="max-w-sm mx-auto p-6">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-2">Salas Disponibles</h2>
          <p className="text-sm text-gray-600">Consulta la disponibilidad de todas las salas</p>
        </div>

        {/* Barra de Búsqueda y Filtros */}
        <Card className="mb-4">
          <div className="relative mb-3">
            <HiMagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="text"
              placeholder="Buscar por sala o edificio..."
              value={busquedaTexto}
              onChange={(e) => setBusquedaTexto(e.target.value)}
              className="w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
            />
            {busquedaTexto && (
              <button
                onClick={() => setBusquedaTexto("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <HiXMark className="text-xl" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => { setMostrarFiltroEquipamiento(!mostrarFiltroEquipamiento); setMostrarFiltroEdificio(false); }}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${mostrarFiltroEquipamiento ? 'bg-blue-50 text-blue-700 border-2 border-blue-200' : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-2 border-transparent'}`}
            >
              <div className="flex items-center gap-1.5"><HiAdjustmentsHorizontal className="text-lg" /><span className="font-medium text-xs">Equipamiento</span></div>
              {mostrarFiltroEquipamiento ? <HiChevronUp /> : <HiChevronDown />}
            </button>
            <button
              onClick={() => { setMostrarFiltroEdificio(!mostrarFiltroEdificio); setMostrarFiltroEquipamiento(false); }}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${mostrarFiltroEdificio ? 'bg-blue-50 text-blue-700 border-2 border-blue-200' : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-2 border-transparent'}`}
            >
              <div className="flex items-center gap-1.5"><HiBuildingOffice2 className="text-lg" /><span className="font-medium text-xs">Edificio</span></div>
              {mostrarFiltroEdificio ? <HiChevronUp /> : <HiChevronDown />}
            </button>
          </div>

          {/* Paneles de Filtros */}
          {mostrarFiltroEquipamiento && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {etiquetasEquipamiento.map(etiqueta => (
                  <button key={etiqueta} onClick={() => toggleEtiqueta(etiqueta)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${etiquetasSeleccionadas.includes(etiqueta) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{etiqueta}</button>
                ))}
              </div>
            </div>
          )}

          {mostrarFiltroEdificio && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {etiquetasEdificio.map(etiqueta => (
                  <button key={etiqueta} onClick={() => toggleEtiqueta(etiqueta)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${etiquetasSeleccionadas.includes(etiqueta) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{etiqueta}</button>
                ))}
              </div>
            </div>
          )}

          {etiquetasSeleccionadas.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="text-xs font-semibold text-gray-600 mb-2">Filtros activos:</div>
              <div className="flex flex-wrap gap-1.5">
                {etiquetasSeleccionadas.map(etiqueta => (
                  <div key={etiqueta} className="flex items-center gap-1 px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                    <span>{etiqueta}</span>
                    <button onClick={() => toggleEtiqueta(etiqueta)} className="hover:bg-blue-700 rounded-full p-0.5"><HiXMark className="text-sm" /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(busquedaTexto || etiquetasSeleccionadas.length > 0) && (
            <button onClick={limpiarFiltros} className="mt-3 w-full text-sm text-red-600 hover:text-red-700 font-medium py-2">Limpiar todos los filtros</button>
          )}
        </Card>

        {/* Resultados */}
        {salasFiltradas.length === 0 ? (
          <Card className="text-center py-8"><p className="text-gray-500">No se encontraron salas</p></Card>
        ) : (
          <div className="mb-2 text-sm text-gray-600">{salasFiltradas.length} sala(s) encontrada(s)</div>
        )}

        <div className="space-y-4">
          {salasFiltradas.map((sala) => {
            const isExpanded = salaExpandida === sala.id;
            
            // Cálculo de disponibilidad
            const bloquesOcupadosCount = bloques.filter(b => verificarOcupacion(sala, b)).length;
            const bloquesDisponiblesCount = bloques.length - bloquesOcupadosCount;

            return (
              <Card key={sala.id} className="overflow-hidden">
                <button onClick={() => toggleSala(sala.id)} className="w-full text-left">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800">Sala {sala.nombre}</h3>
                      <p className="text-sm text-gray-600">{sala.edificio}</p>
                    </div>
                    <div className="text-right mr-2">
                      <div className="text-xs text-gray-500">Disp (aprox)</div>
                      {/* CAMBIO VISUAL: Formato Disponibles / Total */}
                      <div className="text-xl font-bold text-green-600">
                        {bloquesDisponiblesCount}/{bloques.length}
                      </div>
                    </div>
                    <div className="text-2xl text-gray-400">{isExpanded ? "▲" : "▼"}</div>
                  </div>
                </button>

                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="mb-4 space-y-2 text-sm text-gray-700">
                      <div className="flex items-center"><HiBuildingOffice2 className="text-lg mr-2" /><span className="font-semibold mr-2">Edificio:</span><span>{sala.edificio}</span></div>
                      <div className="flex items-center"><HiUsers className="text-lg mr-2" /><span className="font-semibold mr-2">Capacidad:</span><span>{sala.capacidad} personas</span></div>
                    </div>

                    {sala.etiquetas && (
                      <div className="flex flex-wrap gap-1.5 mb-4 pb-4 border-b border-gray-200">
                        {sala.etiquetas.map(etiq => (
                          <span key={etiq} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-200">{etiq}</span>
                        ))}
                      </div>
                    )}

                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-800 mb-2 text-sm flex items-center gap-2"><HiCalendar className="text-lg" /> Seleccionar Fecha</h4>
                      <input
                        type="date"
                        value={fechaSeleccionada}
                        onChange={(e) => setFechaSeleccionada(e.target.value)}
                        min={hoy.toISOString().split('T')[0]}
                        max={maxFecha.toISOString().split('T')[0]}
                        className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>

                    <div className="mb-3">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Estado por bloque:</h4>
                      <div className="grid grid-cols-4 gap-2">
                        {bloques.map((bloque) => {
                          const ocupado = verificarOcupacion(sala, bloque);
                          const seleccionado = bloqueSeleccionado === bloque && salaSeleccionada?.id === sala.id;
                          return (
                            <button
                              key={bloque}
                              onClick={() => !ocupado && handleSeleccionarBloque(sala, bloque)}
                              disabled={ocupado}
                              className={`text-center py-2 rounded-lg text-xs font-semibold transition-all ${ocupado ? "bg-red-100 text-red-800 cursor-not-allowed border border-red-200" : seleccionado ? "bg-blue-600 text-white ring-2 ring-blue-400 shadow-lg scale-105" : "bg-green-100 text-green-800 hover:bg-green-200 cursor-pointer border border-green-200"}`}
                            >
                              {bloque}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {bloqueSeleccionado && salaSeleccionada?.id === sala.id && (
                      <div className="mb-3">
                        <Button onClick={handleReservar} variant="primary" className="w-full flex items-center justify-center gap-2"><HiCheckCircle className="text-xl" /> Reservar Bloque {bloqueSeleccionado}</Button>
                      </div>
                    )}

                    {/* Botón Compartir con Lógica Nativa */}
                    <button onClick={() => handleBotonCompartir(sala)} className="w-full flex items-center justify-center gap-2 py-2.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-gray-200 active:scale-95"><HiShare className="text-base" /> Compartir Horario</button>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        <Card className="mt-6 bg-blue-50 border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2"><HiChartBar /> Leyenda</h4>
          <div className="space-y-1 text-sm">
            <div className="flex items-center"><div className="w-4 h-4 bg-green-100 border border-green-300 rounded mr-2"></div><span className="text-gray-700">Bloque disponible</span></div>
            <div className="flex items-center"><div className="w-4 h-4 bg-red-100 border border-red-300 rounded mr-2"></div><span className="text-gray-700">Bloque ocupado</span></div>
          </div>
        </Card>
      </div>
      
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {mostrarConfirmacion && salaSeleccionada && bloqueSeleccionado && (
        <ConfirmModal
          title="Confirmar Reserva"
          message={`¿Confirmar reserva de sala ${salaSeleccionada.nombre} para el bloque ${bloqueSeleccionado} el ${fechaSeleccionada}?`}
          onConfirm={confirmarReserva}
          onCancel={() => setMostrarConfirmacion(false)}
        />
      )}

      {/* Menú Fallback Desktop */}
      {mostrarCompartir && (
        <div className="fixed inset-0 z-[60] flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/50 transition-opacity" onClick={() => setMostrarCompartir(null)}></div>
          
          <div className="relative bg-white rounded-t-2xl shadow-2xl p-6 pb-10 animate-slide-up max-h-[90vh] overflow-y-auto">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6"></div>
            
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Compartir Horario</h3>
                <p className="text-sm text-gray-500">Sala {mostrarCompartir.nombre} - {mostrarCompartir.edificio}</p>
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
                  <span className="text-xs text-gray-500">Enviar enlace</span>
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
