# SchoolSync - Sistema de Gestión y Comunicación Escolar

## 📋 Sobre el Proyecto

**SchoolSync** es una plataforma web diseñada para resolver un problema real de comunicación y organización en escuelas internacionales. Este proyecto nace de la necesidad real observada por mi persona en instituciones educativas donde la coordinación entre profesores y familias es compleja, especialmente cuando hay barreras lingüísticas, horarios diversos y múltiples canales de comunicación desorganizados.

### 🎯 Problema que Resuelve

En muchas escuelas internacionales actuales, la comunicación entre docentes y padres/madres está fragmentada:
- **Información dispersa:** Tareas, exámenes y eventos se comunican por email, WhatsApp, agendas físicas o aplicaciones diversas
- **Falta de centralización:** No existe un único punto de consulta para fechas importantes
- **Pérdida de información:** Mensajes importantes se pierden entre conversaciones o no llegan a todos los padres
- **Tiempo perdido:** Profesores dedican tiempo excesivo a enviar recordatorios individuales
- **Barrera de acceso:** Familias con limitaciones tecnológicas o de idioma tienen dificultades para seguir la comunicación

### 💡 Solución Propuesta

SchoolSync centraliza toda la información académica relevante en una plataforma web accesible, moderna y fácil de usar:

- **Calendario unificado:** Todas las tareas, exámenes, eventos y notas importantes en un solo lugar
- **Roles diferenciados:** Profesores pueden crear y gestionar información; padres pueden visualizar y estar al día
- **Acceso universal:** Plataforma web responsive accesible desde cualquier dispositivo con navegador
- **Notificaciones claras:** Sistema organizado por tipos de eventos (tareas, exámenes, notas, eventos)
- **Reducción de carga administrativa:** Automatización de comunicaciones rutinarias

### 🏫 Impacto Esperado

- **Para profesores:** Ahorro de tiempo en comunicaciones repetitivas, mejor organización del contenido educativo
- **Para familias:** Visibilidad completa del calendario escolar, reducción de estrés por información perdida
- **Para la institución:** Mejor imagen profesional, mayor satisfacción de familias, comunicación más eficiente

## 🚧 Estado Actual del Proyecto

Este proyecto está en **desarrollo activo**. Actualmente cuenta con:

- ✅ **Frontend completo y funcional** desarrollado con React + Vite.
- ✅ **Sistema de autenticación con roles** (profesor/padre)
- ✅ **Calendario interactivo** con FullCalendar y permisos diferenciados
- ✅ **Arquitectura preparada para backend** con servicios API estructurados
- 🔄 **UI/UX Simple** Dado que el proyecto es relativamente nuevo, seguiré implementando mejoras de experiencia del usuario
- 🔄 **Backend en desarrollo** - Estoy actualmente aprendiendo desarrollo backend (Node.js, Express, bases de datos) para implementar la capa de servidor y persistencia real

**Roadmap inmediato:**
1. Implementación de backend con autenticación JWT
2. Base de datos para persistencia de usuarios y eventos
3. API REST para comunicación frontend-backend
4. Sistema de notificaciones por email
5. Panel de administración para gestión de usuarios
6. Despliegue en producción para pruebas reales en escuela

## 🚀 Características Implementadas

- **Sistema de Login** con roles diferenciados (Profesor/Padre)
- **Calendario Interactivo** usando FullCalendar con 4 tipos de eventos
- **Dashboard personalizado** según rol de usuario
- **Arquitectura escalable** con separación de componentes, servicios y contexto
- **Responsive Design** optimizado para móviles, tablets y escritorio
- **Preparación completa para backend** con cliente HTTP y estructura de servicios API

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

El proyecto esta siendo preparado para conectar con un backend:

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
Técnicas

### Desarrollo Actual
- **Persistencia temporal:** Los datos se guardan en `localStorage` del navegador (temporal hasta implementar backend)
- **Autenticación demo:** El login actual valida contra usuarios dummy en el código (se reemplazará con JWT y base de datos)
- **Puntos de integración:** Busca comentarios `// TODO: BACKEND` en el código para identificar dónde conectar con el servidor
- **Arquitectura preparada:** Todos los servicios están diseñados para migrar fácilmente a llamadas HTTP reales

### Decisiones de Diseño
- **React + Vite:** Elegidos por velocidad de desarrollo y experiencia moderna
- **FullCalendar:** Librería madura y robusta para gestión de eventos
- **Context API:** Gestión de estado sin dependencias adicionales (suficiente para el alcance actual)
- **CSS Modules:** Estilos modulares por componente para mantenibilidad

## 🎨 Personalización

- **Colores y tema:** Edita variables en `/src/styles/index.css`
- **Roles adicionales:** Modifica la configuración en `/src/services/authService.js`
- **Tipos de eventos:** Personaliza categorías en `/src/components/Calendar/Calendar.jsx`
- **Textos e idioma:** Los strings están en los componentes (próximo paso: i18n)

## 🤝 Contribución y Contacto

Este es un proyecto personal en desarrollo activo. Si estás interesado en colaborar, tienes sugerencias o quieres implementar algo similar en tu institución educativa, no dudes en contactar.

**Próximos pasos en el desarrollo:**
- [ ] Implementar backend 
- [ ] Configurar base de datos (PostgreSQL)
- [ ] Sistema de autenticación con JWT
- [ ] API REST completa
- [ ] Sistema de notificaciones
- [ ] Tests automatizados
- [ ] Despliegue en producción
- [ ] Internacionalización (i18n)
- [ ] Panel de administración avanzado

## 📄 Licencia

Este proyecto está en desarrollo y es de uso educativo. Los derechos de uso para instituciones educativas reales se definirán una vez completada la implementación.

---

**Desarrollado con la visión de mejorar la comunicación y organización en escuelas internacionales** 🎓✨
