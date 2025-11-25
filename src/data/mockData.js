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
  "Proyector",
  "Mesas Grupales",
  "Computadores",
  "Ventilación",
  "Televisores",
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
    capacidad: 20,
    equipamiento: "Proyector",
    edificio: "Edificio P",
    etiquetas: ["Proyector", "Edificio P"],
  },
  {
    id: 2,
    nombre: "P-207",
    ocupados: ["1-2", "5-6", "9-10"],
    capacidad: 30,
    equipamiento: "Proyector y ventilación",
    edificio: "Edificio P",
    etiquetas: ["Ventilación", "Proyector", "Edificio P"],
  },
  {
    id: 3,
    nombre: "C-228",
    ocupados: [],
    capacidad: 80,
    equipamiento: "Proyector",
    edificio: "Edificio C",
    etiquetas: ["Proyector", "Edificio C"],
  },
  {
    id: 4,
    nombre: "M-103",
    ocupados: ["3-4", "11-12"],
    capacidad: 50,
    equipamiento: "Proyector, pizarra y aire acondicionado",
    edificio: "Edificio M",
    etiquetas: ["Proyector", "Edificio M"],
  },
  {
    id: 5,
    nombre: "F-104",
    ocupados: ["1-2", "3-4", "5-6"],
    capacidad: 20,
    equipamiento: "Televisores", 
    edificio: "Edificio F",
    etiquetas: ["Televisores", "Edificio F"],
  },
  {
    id: 6,
    nombre: "PC-01",
    ocupados: ["7-8", "9-10", "13-14"],
    capacidad: 1,
    equipamiento: "Proyector y computadores",
    edificio: "Edificio P",
    etiquetas: ["Proyector", "Computadores", "Edificio P"],
  }
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
