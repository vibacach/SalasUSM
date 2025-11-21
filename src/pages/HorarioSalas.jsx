import React, { useState } from "react";
import Header from "../components/Header";
import Card from "../components/Card";
import Button from "../components/Button";
import ConfirmModal from "../components/ConfirmModal";
import Toast from "../components/Toast";
import { salas, bloques, etiquetasEquipamiento, etiquetasEdificio } from "../data/mockData";
import { HiUsers, HiComputerDesktop, HiChartBar, HiCheckCircle, HiMagnifyingGlass, HiXMark, HiShare, HiAdjustmentsHorizontal, HiChevronDown, HiChevronUp, HiBuildingOffice2, HiCalendar } from "react-icons/hi2";

export default function HorarioSalas({ onNavigate, onReservar }) {
  const [salaExpandida, setSalaExpandida] = useState(null);
  const [bloqueSeleccionado, setBloqueSeleccionado] = useState(null);
  const [salaSeleccionada, setSalaSeleccionada] = useState(null);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [busquedaTexto, setBusquedaTexto] = useState("");
  const [etiquetasSeleccionadas, setEtiquetasSeleccionadas] = useState([]);
  const [mostrarCompartir, setMostrarCompartir] = useState(null);
  const [mostrarFiltroEquipamiento, setMostrarFiltroEquipamiento] = useState(false);
  const [mostrarFiltroEdificio, setMostrarFiltroEdificio] = useState(false);
  const [fechaSeleccionada, setFechaSeleccionada] = useState("");
  const [toast, setToast] = useState(null);

  const hoy = new Date();
  const maxFecha = new Date();
  maxFecha.setDate(hoy.getDate() + 7);

  if (!fechaSeleccionada) {
    setFechaSeleccionada(hoy.toISOString().split('T')[0]);
  }

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
    // Filtro por texto
    const coincideTexto = sala.nombre.toLowerCase().includes(busquedaTexto.toLowerCase()) ||
                          sala.edificio.toLowerCase().includes(busquedaTexto.toLowerCase());
    
    // Filtro por etiquetas (debe tener TODAS las etiquetas seleccionadas)
    const coincideEtiquetas = etiquetasSeleccionadas.length === 0 ||
                              etiquetasSeleccionadas.every(etiq => sala.etiquetas.includes(etiq));
    
    return coincideTexto && coincideEtiquetas;
  });

  const compartirHorario = (sala) => {
    const bloquesDisponibles = bloques.filter(b => !sala.ocupados.includes(b));
    const texto = `📅 Horario Sala ${sala.nombre} - ${sala.edificio}\n\n` +
                  `👥 Capacidad: ${sala.capacidad} personas\n` +
                  `🖥️ Equipamiento: ${sala.equipamiento}\n\n` +
                  `✅ Bloques Disponibles:\n${bloquesDisponibles.join(', ')}\n\n` +
                  `❌ Bloques Ocupados:\n${sala.ocupados.join(', ') || 'Ninguno'}`;
    
    return texto;
  };

  const handleCompartir = (sala, medio) => {
    const texto = compartirHorario(sala);
    const textoEncoded = encodeURIComponent(texto);
    
    switch(medio) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${textoEncoded}`, '_blank');
        break;
      case 'copiar':
        navigator.clipboard.writeText(texto);
        setToast({
          type: "success",
          message: "Horario copiado al portapapeles"
        });
        break;
      case 'outlook':
        window.open(`mailto:?subject=Horario Sala ${sala.nombre}&body=${textoEncoded}`, '_blank');
        break;
      default:
        break;
    }
    setMostrarCompartir(null);
  };

  const toggleSala = (salaId) => {
    setSalaExpandida(salaExpandida === salaId ? null : salaId);
    setBloqueSeleccionado(null); // Reset selección al cambiar de sala
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
      message: `Reserva confirmada: Sala ${salaSeleccionada.nombre} - Bloque ${bloqueSeleccionado} - ${fechaSeleccionada}`
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
          <h2 className="text-lg font-bold text-gray-800 mb-2">
            Salas Disponibles
          </h2>
          <p className="text-sm text-gray-600">
            Consulta la disponibilidad de todas las salas
          </p>
        </div>

        {/* Barra de búsqueda y filtros unificada */}
        <Card className="mb-4">
          {/* Búsqueda por texto */}
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
                aria-label="Limpiar búsqueda"
              >
                <HiXMark className="text-xl" />
              </button>
            )}
          </div>

          {/* Botones de filtros en horizontal */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setMostrarFiltroEquipamiento(!mostrarFiltroEquipamiento);
                setMostrarFiltroEdificio(false);
              }}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
                mostrarFiltroEquipamiento 
                  ? 'bg-blue-50 text-blue-700 border-2 border-blue-200' 
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-2 border-transparent'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <HiAdjustmentsHorizontal className="text-lg" />
                <span className="font-medium text-xs">Equipamiento</span>
              </div>
              {mostrarFiltroEquipamiento ? (
                <HiChevronUp className="text-base" />
              ) : (
                <HiChevronDown className="text-base" />
              )}
            </button>

            <button
              onClick={() => {
                setMostrarFiltroEdificio(!mostrarFiltroEdificio);
                setMostrarFiltroEquipamiento(false);
              }}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
                mostrarFiltroEdificio 
                  ? 'bg-blue-50 text-blue-700 border-2 border-blue-200' 
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-2 border-transparent'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <HiBuildingOffice2 className="text-lg" />
                <span className="font-medium text-xs">Edificio</span>
              </div>
              {mostrarFiltroEdificio ? (
                <HiChevronUp className="text-base" />
              ) : (
                <HiChevronDown className="text-base" />
              )}
            </button>
          </div>

          {/* Panel de equipamiento desplegable */}
          {mostrarFiltroEquipamiento && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {etiquetasEquipamiento.map(etiqueta => (
                  <button
                    key={etiqueta}
                    onClick={() => toggleEtiqueta(etiqueta)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      etiquetasSeleccionadas.includes(etiqueta)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {etiqueta}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Panel de edificio desplegable */}
          {mostrarFiltroEdificio && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {etiquetasEdificio.map(etiqueta => (
                  <button
                    key={etiqueta}
                    onClick={() => toggleEtiqueta(etiqueta)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      etiquetasSeleccionadas.includes(etiqueta)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {etiqueta}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Mostrar etiquetas seleccionadas */}
          {etiquetasSeleccionadas.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="text-xs font-semibold text-gray-600 mb-2">Filtros activos:</div>
              <div className="flex flex-wrap gap-1.5">
                {etiquetasSeleccionadas.map(etiqueta => (
                  <div
                    key={etiqueta}
                    className="flex items-center gap-1 px-2 py-1 bg-blue-600 text-white text-xs rounded-full"
                  >
                    <span>{etiqueta}</span>
                    <button
                      onClick={() => toggleEtiqueta(etiqueta)}
                      className="hover:bg-blue-700 rounded-full p-0.5"
                      aria-label={`Quitar filtro ${etiqueta}`}
                    >
                      <HiXMark className="text-sm" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Botón limpiar todo (solo si hay filtros activos) */}
          {(busquedaTexto || etiquetasSeleccionadas.length > 0) && (
            <button
              onClick={limpiarFiltros}
              className="mt-3 w-full text-sm text-red-600 hover:text-red-700 font-medium py-2"
            >
              Limpiar todos los filtros
            </button>
          )}
        </Card>

        {/* Resultados */}
        {salasFiltradas.length === 0 ? (
          <Card className="text-center py-8">
            <p className="text-gray-500">No se encontraron salas con los filtros seleccionados</p>
          </Card>
        ) : (
          <div className="mb-2 text-sm text-gray-600">
            {salasFiltradas.length} sala{salasFiltradas.length !== 1 ? 's' : ''} encontrada{salasFiltradas.length !== 1 ? 's' : ''}
          </div>
        )}

        <div className="space-y-4">
          {salasFiltradas.map((sala) => {
            const isExpanded = salaExpandida === sala.id;
            const bloquesDisponibles = bloques.filter(
              (b) => !sala.ocupados.includes(b)
            ).length;
            const bloquesOcupados = sala.ocupados.length;

            return (
              <Card key={sala.id} className="overflow-hidden">
                {/* Header de la sala - Clickeable */}
                <button
                  onClick={() => toggleSala(sala.id)}
                  className="w-full text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800">
                        Sala {sala.nombre}
                      </h3>
                      <p className="text-sm text-gray-600">{sala.edificio}</p>
                    </div>
                    <div className="text-right mr-2">
                      <div className="text-xs text-gray-500">Disponibles</div>
                      <div className="text-2xl font-bold text-green-600">
                        {bloquesDisponibles}/{bloques.length}
                      </div>
                    </div>
                    <div className="text-2xl text-gray-400">
                      {isExpanded ? "▲" : "▼"}
                    </div>
                  </div>
                </button>

                {/* Contenido expandible */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    {/* Información de la sala */}
                    <div className="mb-4 space-y-2 text-sm text-gray-700">
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
                      <div className="flex flex-wrap gap-1.5 mb-4 pb-4 border-b border-gray-200">
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

                    {/* Selector de Fecha */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-800 mb-2 text-sm flex items-center gap-2">
                        <HiCalendar className="text-lg" /> Seleccionar Fecha
                      </h4>
                      <input
                        type="date"
                        value={fechaSeleccionada}
                        onChange={(e) => setFechaSeleccionada(e.target.value)}
                        min={hoy.toISOString().split('T')[0]}
                        max={maxFecha.toISOString().split('T')[0]}
                        className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Puedes reservar hasta 7 días de anticipación
                      </p>
                    </div>

                    {/* Grid de bloques */}
                    <div className="mb-3">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">
                        Estado por bloque:
                      </h4>
                      <div className="grid grid-cols-4 gap-2">
                        {bloques.map((bloque) => {
                          const ocupado = sala.ocupados.includes(bloque);
                          const seleccionado = bloqueSeleccionado === bloque && salaSeleccionada?.id === sala.id;
                          return (
                            <button
                              key={bloque}
                              onClick={() => !ocupado && handleSeleccionarBloque(sala, bloque)}
                              disabled={ocupado}
                              className={`
                                text-center py-2 rounded-lg text-xs font-semibold transition-all
                                ${ocupado 
                                  ? "bg-red-100 text-red-800 cursor-not-allowed" 
                                  : seleccionado
                                    ? "bg-blue-600 text-white ring-2 ring-blue-400 shadow-lg scale-105"
                                    : "bg-green-100 text-green-800 hover:bg-green-200 cursor-pointer"
                                }
                              `}
                            >
                              {bloque}
                            </button>
                          );
                        })}
                      </div>
                      {bloqueSeleccionado && salaSeleccionada?.id === sala.id && (
                        <p className="text-xs text-blue-600 mt-2 font-medium flex items-center gap-1">
                          <HiCheckCircle /> Bloque {bloqueSeleccionado} seleccionado
                        </p>
                      )}
                    </div>

                    {/* Botón de Reservar */}
                    {bloqueSeleccionado && salaSeleccionada?.id === sala.id && (
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
                    <div className="flex justify-around text-xs bg-gray-50 rounded-lg p-2 mb-3">
                      <div className="text-center">
                        <div className="font-semibold text-green-600">
                          {bloquesDisponibles}
                        </div>
                        <div className="text-gray-600">Disponibles</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-red-600">
                          {bloquesOcupados}
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

                    {/* Botón compartir horario - Al final */}
                    <button
                      onClick={() => setMostrarCompartir(sala)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-gray-200"
                    >
                      <HiShare className="text-base" /> Compartir Horario
                    </button>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Leyenda */}
        <Card className="mt-6 bg-blue-50 border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <HiChartBar /> Leyenda
          </h4>
          <div className="space-y-1 text-sm">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-100 border border-green-300 rounded mr-2"></div>
              <span className="text-gray-700">Bloque disponible</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-100 border border-red-300 rounded mr-2"></div>
              <span className="text-gray-700">Bloque ocupado</span>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Toast de notificación */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Modal de confirmación */}
      {mostrarConfirmacion && salaSeleccionada && bloqueSeleccionado && (
        <ConfirmModal
          title="Confirmar Reserva"
          message={`¿Confirmar reserva de sala ${salaSeleccionada.nombre} para el bloque ${bloqueSeleccionado} el ${fechaSeleccionada}?`}
          onConfirm={confirmarReserva}
          onCancel={() => setMostrarConfirmacion(false)}
        />
      )}

      {/* Modal de compartir (copiar alert con toast) */}

      {/* Modal de compartir */}
      {mostrarCompartir && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full animate-scale-in">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  Compartir Horario
                </h3>
                <button
                  onClick={() => setMostrarCompartir(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <HiXMark className="text-2xl" />
                </button>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                Sala {mostrarCompartir.nombre} - {mostrarCompartir.edificio}
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
