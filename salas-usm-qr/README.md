# 📱 Salas USM QR - MVP Frontend

## 🎯 Descripción del Proyecto

Sistema de gestión de reservas de salas para la Universidad Técnica Federico Santa María (USM). Este es un **Producto Mínimo Viable (MVP)** que simula la funcionalidad de escaneo QR para reservar salas académicas.

## ✨ Funcionalidades

### 🏠 Pantalla Principal (Home)
- Botón principal grande para **Escanear Sala**
- Acceso rápido a **Mis Reservas**
- Consulta del **Horario de Salas**

### 📷 Escanear QR (Simulado)
- Simulación de escaneo de código QR
- Lista de 5 salas disponibles para seleccionar
- Navegación directa al detalle de la sala

### 🏢 Detalle de Sala
- Información completa de la sala (capacidad, equipamiento, edificio)
- Visualización de bloques disponibles y ocupados
- Reserva inmediata de bloques disponibles
- Confirmación visual del estado

### 📋 Mis Reservas
- Lista de reservas activas con datos de ejemplo
- Información detallada (sala, bloque, fecha, usuario)
- Cancelación de reservas
- Estado en tiempo real

### 🕐 Horario de Salas
- Vista consolidada de todas las salas
- Disponibilidad por bloques para cada sala
- Información expandible con detalles
- Estadísticas visuales de ocupación

## 📁 Estructura del Proyecto

```
salas-usm-qr/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── Button.jsx       # Botón personalizado
│   │   ├── Card.jsx         # Tarjeta de contenido
│   │   └── Header.jsx       # Encabezado con navegación
│   │
│   ├── pages/              # Páginas/Vistas principales
│   │   ├── Home.jsx        # Pantalla principal
│   │   ├── EscanearQR.jsx  # Simulación de escaneo
│   │   ├── DetalleSala.jsx # Detalle y reserva de sala
│   │   ├── MisReservas.jsx # Gestión de reservas
│   │   └── HorarioSalas.jsx # Vista de horarios
│   │
│   ├── data/               # Datos mock
│   │   └── mockData.js     # Salas, bloques y reservas de ejemplo
│   │
│   ├── App.jsx             # Componente principal con navegación
│   ├── main.jsx            # Punto de entrada
│   └── index.css           # Estilos globales
│
└── public/                 # Archivos estáticos
```

## 🛠️ Tecnologías Utilizadas

- **React 19** - Framework de interfaz de usuario
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Framework de estilos utility-first
- **ESLint** - Linter para calidad de código

## 🚀 Instalación y Ejecución

### Prerrequisitos
- Node.js v16 o superior
- npm (incluido con Node.js)

### Pasos

1. **Instalar dependencias** (primera vez)
   ```bash
   npm install
   ```

2. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   ```

3. **Abrir en el navegador**
   - La aplicación se ejecutará en `http://localhost:5173/`
   - Usa las herramientas de desarrollo (F12) y activa la vista móvil (Ctrl+Shift+M)

## 📱 Visualización

La aplicación está **optimizada para dispositivos móviles**. Para una mejor experiencia en PC:

1. Abre las DevTools (F12)
2. Activa el modo dispositivo móvil (Ctrl+Shift+M o icono 📱)
3. Selecciona un dispositivo (ej: iPhone 12, Samsung Galaxy)

## 🎨 Características de Diseño

- **Mobile-first**: Diseñado específicamente para smartphones
- **Interfaz intuitiva**: Navegación simple y clara
- **Componentes reutilizables**: Arquitectura modular
- **Feedback visual**: Confirmaciones y estados claros
- **Accesibilidad**: Colores contrastantes y textos legibles

## 📊 Datos Mock

El proyecto incluye datos de ejemplo para demostración:

- **5 salas** con diferente disponibilidad
- **8 bloques horarios** (1-2, 3-4, ... 15-16)
- **3 reservas de ejemplo** precargadas
- Estados de ocupación realistas

## 🔮 Próximos Pasos (Backend)

Esta es la versión **frontend-only**. La integración futura incluirá:

- [ ] Conexión con API REST
- [ ] Autenticación de usuarios
- [ ] Scanner de QR real con cámara
- [ ] Persistencia de datos en base de datos
- [ ] Notificaciones push
- [ ] Sistema de permisos y roles

## 📝 Comandos Disponibles

```bash
npm run dev      # Inicia servidor de desarrollo
npm run build    # Construye para producción
npm run preview  # Previsualiza build de producción
npm run lint     # Verifica errores de código
```

## 🤝 Contribución

Este proyecto es parte del curso INF322 - USM.

## 📄 Licencia

Proyecto académico - USM 2025-2

---

**Desarrollado con ❤️ para la comunidad USM**
