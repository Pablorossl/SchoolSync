# SchoolSync - Aplicación Web para Escuelas

Una aplicación moderna de gestión escolar que permite a profesores y padres coordinar tareas, eventos y comunicaciones.

## 🚀 Características

- **Sistema de Login** con roles (Profesor/Padre)
- **Calendario Interactivo** usando FullCalendar
- **Dashboard personalizado** según rol de usuario
- **Preparado para Backend** con estructura de servicios API
- **Responsive Design** para móviles y tablets

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build
```

## 🔑 Credenciales de Prueba (Demo)

### Profesor
- **Email:** profesor@schoolsync.com
- **Contraseña:** profesor123

### Padre/Madre
- **Email:** padre@schoolsync.com
- **Contraseña:** padre123

## 📁 Estructura del Proyecto

```
schoolSync/
├── src/
│   ├── components/       # Componentes reutilizables
│   ├── pages/           # Páginas principales
│   ├── services/        # Servicios para llamadas API
│   ├── context/         # Context API para estado global
│   ├── assets/          # Imágenes y recursos estáticos
│   ├── styles/          # Estilos CSS
│   ├── App.jsx          # Componente principal
│   └── main.jsx         # Punto de entrada
├── index.html
├── package.json
└── vite.config.js
```

## 🔄 Integración con Backend (Futuro)

El proyecto está preparado para conectar con un backend:

1. **Configurar variables de entorno:** Copia `.env.example` a `.env` y configura la URL del backend
2. **Servicios API:** Los archivos en `/src/services/` contienen comentarios indicando dónde implementar llamadas reales
3. **Autenticación:** Reemplazar `authService.js` con llamadas HTTP reales y almacenar tokens JWT
4. **Calendario:** Conectar eventos del calendario con endpoints de backend

## 🛠️ Tecnologías

- **Vite** - Build tool rápido
- **React 18** - Framework UI
- **React Router** - Navegación
- **FullCalendar** - Calendario interactivo
- **LocalStorage** - Persistencia temporal (reemplazar con API)

## 📝 Notas de Desarrollo

- Los datos actualmente se guardan en `localStorage`
- El login es solo frontend (validación dummy)
- Busca comentarios `// TODO: BACKEND` para puntos de integración
- Todos los componentes están preparados para recibir datos de API

## 🎨 Personalización

- **Colores:** Edita `/src/styles/variables.css`
- **Roles adicionales:** Modifica `/src/services/authService.js`
- **Calendario:** Personaliza en `/src/components/Calendar/Calendar.jsx`

---

**Listo para empezar a trabajar hoy mismo** 🎉
