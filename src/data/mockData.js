// Bloques horarios disponibles (representan rangos de horas)
export const bloques = [
  "1-2",
  "3-4",
  "5-6",
  "7-8",
  "9-10",
  "11-12",
  "13-14",
  "15-16",
];

// Etiquetas disponibles para filtrar
export const etiquetasEquipamiento = [
  "Pizarra",
  "Proyector",
  "Mesas Grupales",
  "Computadores",
  "Aire Acondicionado",
];

export const etiquetasEdificio = [
  "Edificio P",
  "Edificio C",
  "Edificio M",
  "Edificio F",
];

// Salas disponibles en el sistema
export const salas = [
  {
    id: 1,
    nombre: "P-101",
    ocupados: ["3-4", "7-8"],
    capacidad: 40,
    equipamiento: "Proyector y pizarra",
    edificio: "Principal",
    etiquetas: ["Pizarra", "Proyector", "Mesas Grupales", "Edificio P"],
  },
  {
    id: 2,
    nombre: "P-207",
    ocupados: ["1-2", "5-6", "9-10"],
    capacidad: 60,
    equipamiento: "Computadores y proyector",
    edificio: "Principal",
    etiquetas: ["Proyector", "Computadores", "Edificio P"],
  },
  {
    id: 3,
    nombre: "C-228",
    ocupados: [],
    capacidad: 30,
    equipamiento: "Pizarra blanca",
    edificio: "Casa Central",
    etiquetas: ["Pizarra", "Edificio C"],
  },
  {
    id: 4,
    nombre: "M-103",
    ocupados: ["3-4", "11-12"],
    capacidad: 45,
    equipamiento: "Proyector, pizarra y aire acondicionado",
    edificio: "Mecánica",
    etiquetas: ["Pizarra", "Proyector", "Aire Acondicionado", "Edificio M"],
  },
  {
    id: 5,
    nombre: "F-201",
    ocupados: ["1-2", "3-4", "5-6"],
    capacidad: 50,
    equipamiento: "Laboratorio de computación",
    edificio: "Física",
    etiquetas: ["Computadores", "Mesas Grupales", "Edificio F"],
  },
];

// Reservas de ejemplo (simulación de datos guardados)
export const reservasIniciales = [
  {
    id: 1,
    sala: "P-101",
    bloque: "1-2",
    fecha: "02/11/2025",
    usuario: "Usuario Demo",
  },
  {
    id: 2,
    sala: "M-103",
    bloque: "5-6",
    fecha: "02/11/2025",
    usuario: "Usuario Demo",
  },
  {
    id: 3,
    sala: "C-228",
    bloque: "9-10",
    fecha: "03/11/2025",
    usuario: "Usuario Demo",
  },
];
