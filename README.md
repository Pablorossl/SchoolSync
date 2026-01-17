# SchoolSync - Sistema de Gestión y Comunicación Escolar

## Sobre el Proyecto

**SchoolSync** es una plataforma web moderna de gestión y coordinación diseñada para resolver problemas reales de comunicación en entornos educativos. El proyecto surge de la identificación de ineficiencias en la coordinación entre múltiples stakeholders en instituciones con necesidades organizativas complejas.

### Visión del Proyecto

Este sistema está diseñado para abordar desafíos comunes en la gestión de información y coordinación entre diferentes roles de usuarios, proporcionando una solución centralizada y eficiente.

**Características principales:**
- Sistema de gestión de información temporal con visualización intuitiva
- Arquitectura multi-rol con permisos diferenciados
- Interfaz responsive y accesible desde múltiples dispositivos
- Organización eficiente de contenido por categorías

### Enfoque de Solución

- **Centralización de información:** Punto único de acceso a contenido relevante
- **Gestión basada en roles:** Diferentes niveles de permisos y funcionalidades
- **Experiencia de usuario optimizada:** Diseño moderno y flujo de trabajo intuitivo
- **Escalabilidad:** Arquitectura preparada para crecimiento y nuevas funcionalidades

## Estado Actual del Proyecto

> **NOTA IMPORTANTE:** Este proyecto está en **desarrollo activo continuo**. Tanto el frontend como el backend están siendo mejorados constantemente. Nuevas características, mejoras de UX/UI y optimizaciones se implementan regularmente. El código y las funcionalidades evolucionan semana a semana.

Este proyecto está en **fase de desarrollo intensivo**. Actualmente cuenta con:

- ✅ **Frontend funcional base** desarrollado con React + Vite
- ✅ **Sistema de autenticación con roles** (profesor/padre)
- ✅ **Calendario interactivo** con FullCalendar y permisos diferenciados
- ✅ **Arquitectura preparada para backend** con servicios API estructurados
- 🔄 **Frontend en mejora continua** - Implementando nuevas funcionalidades, mejoras de UX/UI, optimizaciones de rendimiento y refinamiento de componentes
- 🔄 **Backend en desarrollo** - Aprendiendo y desarrollando simultáneamente Node.js, Express, autenticación JWT y gestión de bases de datos para la capa de servidor

**Roadmap de Desarrollo:**

### Fase 1 - Frontend (En Progreso)
- Mejoras continuas de UI/UX y componentes
- Optimización de rendimiento y accesibilidad
- Implementación de tests
- Refinamiento de arquitectura

### Fase 2 - Backend (Próxima)
1. Implementación de servidor y API REST
2. Sistema de autenticación y autorización
3. Capa de persistencia con base de datos
4. Servicios de notificación
5. Documentación de API

### Fase 3 - Producción
1. Integración completa frontend-backend
2. Sistema de administración
3. Testing exhaustivo
4. Despliegue en producción
5. Monitoreo y analytics

## Características Implementadas

### Funcionalidades Actuales
- **Sistema de Autenticación** con control de acceso basado en roles
- **Visualización de eventos temporales** con interfaz interactiva y categorización
- **Dashboard adaptativo** personalizado según permisos de usuario
- **Sistema CRUD** con permisos diferenciados por rol
- **Gestión de datos** con persistencia temporal
- **Sistema de mensajería interactivo** entre profesores y padres
- **Tema claro/oscuro** con persistencia y detección automática
- **Notificaciones toast** para feedback de acciones
- **Tutorial de onboarding** personalizado por rol
- **Diálogos de confirmación** para acciones críticas

### 🎨 Mejoras de UX/UI Recientes

#### Sistema de Temas
- Modo claro y oscuro completamente funcional
- Variables CSS para consistencia visual
- Persistencia de preferencias en localStorage
- Detección automática de tema del sistema
- Transiciones suaves entre temas

#### Notificaciones y Feedback
- Sistema de toast notifications (success/error/warning/info)
- Tooltips contextuales en elementos clave
- Spinners de carga animados
- Estados de loading en operaciones asíncronas
- Confirmaciones modales para acciones destructivas

#### Accesibilidad
- ARIA labels comprehensivos
- Navegación completa por teclado
- Roles semánticos (dialog, listitem, status)
- Screen reader friendly
- Focus visible en elementos interactivos

#### Animaciones
- Entrada escalonada de elementos del dashboard
- Transiciones suaves en cambios de estado
- Hover effects mejorados
- Animaciones de carga fluidas

> 📄 Para más detalles técnicos, consulta `/docs/UX_UI_IMPROVEMENTS.md`

### Arquitectura Técnica
- **Estructura modular** con separación clara de componentes, servicios, contexto y estilos
- **Arquitectura escalable** preparada para crecimiento de funcionalidades
- **Responsive Design** totalmente optimizado para móviles, tablets y escritorio
- **Cliente HTTP preparado** con interceptores y manejo centralizado de errores
- **Servicios API estructurados** listos para conectar con backend
- **Sistema de enrutamiento** protegido con rutas privadas por rol

## Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build
```

## Acceso de Desarrollo

Durante el desarrollo no se comparten credenciales en el README público. Para probar la aplicación en entorno local, usa una de estas opciones:

- Abre la página de login y utiliza los botones de demostración disponibles (Profesor / Padre) para precargar cuentas de ejemplo.
- Crea tu propia cuenta de desarrollo desde la interfaz (registro local) o mediante herramientas de administración privadas.
- Si necesitas acceso directo a las credenciales de demo o a detalles operativos, consulta el documento privado `/docs/PRIVATE.md` (resguardado para colaboradores) o contacta al autor.

> Nota: las credenciales de ejemplo y detalles operativos se mantienen en documentación privada para proteger la idea. Solicita acceso si colaboras en el proyecto.

## Estructura del Proyecto

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

## Integración con Backend (En Preparación)

El proyecto está completamente preparado para la integración con backend:

### Contrato API Completo

El frontend tiene **documentación exhaustiva** del contrato API esperado:

 **[Consulta docs/API_CONTRACT.md](docs/API_CONTRACT.md)** para ver:
- Todos los endpoints necesarios (Auth, Messaging, Calendar)
- Request/Response examples con tipos de datos
- Códigos de error y manejo
- Schema de base de datos sugerido
- Stack tecnológico recomendado
- Prioridad de implementación

### Preparación Actual
1. **Cliente HTTP centralizado** - `apiClient.js` con interceptors para tokens y manejo de errores
2. **Servicios estructurados** - Todos los archivos en `src/services/` tienen comentarios `TODO: BACKEND` indicando puntos de integración
3. **Variables de entorno** - Configurar `.env` desde `.env.example`
4. **Estructura de datos** - Modelos y tipos documentados en API_CONTRACT.md
5. **Tests implementados** - 21 tests protegen servicios críticos

### Para Backend Developers

**Setup rápido:**

```bash
# 1. Clonar y configurar variables
cp .env.example .env
# Editar VITE_API_URL con tu backend URL

# 2. Instalar y correr frontend
npm install
npm run dev

# 3. Implementar endpoints según docs/API_CONTRACT.md
# Empezar con: /auth/login, /auth/verify, /events (GET, POST)

# 4. Testing
npm test  # Ver tests de referencia para estructura de datos
```

**Integración incremental:**
1. Auth endpoints (login, register, verify)
2. Calendar CRUD (GET /events, POST /events, PUT /events/:id, DELETE /events/:id)
3. Messaging básico (GET /conversations, POST /conversations, GET /messages)
4. Real-time con WebSockets (opcional)

**Archivos clave para revisar:**
- `docs/API_CONTRACT.md` - Especificación completa de API
- `src/services/apiClient.js` - Cliente HTTP configurado
- `src/services/authService.js` - Ejemplo de integración
- `src/tests/*.test.js` - Tests de referencia para validar responses

### Modo Mock para Desarrollo Independiente

Si necesitas desarrollar frontend sin esperar al backend, usa el **Mock Service Worker** incluido:

```bash
# 1. Habilitar modo mock en .env
VITE_USE_MOCK_API=true

# 2. Correr el proyecto
npm run dev

# 3. Desarrollar sin dependencias de backend
# Todos los endpoints están mockeados con datos de prueba
```

**Usuarios de prueba mock:**
- Profesor: `profesor@schoolsync.com` / `profesor123`
- Padre: `padre@schoolsync.com` / `padre123`

**Características del Mock:**
- 20+ endpoints mockeados según API_CONTRACT.md
- Persistencia en memoria durante la sesión
- Latencia simulada (100-300ms)
- Validación de tokens y permisos
- Lógica de negocio (unread counters, last message, etc.)

**Documentación completa:** [`docs/MSW_GUIDE.md`](docs/MSW_GUIDE.md)

### Pasos de Integración
1. Configurar variables en `.env` (copia de `.env.example`)
2. Implementar endpoints según `docs/API_CONTRACT.md`
3. Reemplazar funciones dummy en `authService.js` con llamadas HTTP reales
4. Conectar `calendarService.js` con endpoints de eventos
5. Conectar `messagingService.js` con endpoints de mensajería
6. Implementar almacenamiento y validación de tokens JWT
7. Migrar datos de `localStorage` a base de datos

## Stack Tecnológico

### Frontend Actual
- **Vite** - Build tool moderno y rápido
- **React 18** - Librería UI con hooks modernos
- **React Router v6** - Sistema de navegación y rutas protegidas
- **FullCalendar** - Librería profesional para gestión de calendarios
- **Context API** - Gestión de estado global sin dependencias externas
- **LocalStorage** - Persistencia temporal (transitorio hasta backend)

### Backend Planificado
- **Node.js + Express** - Servidor y API REST
- **PostgreSQL** - Base de datos relacional
- **JWT** - Autenticación y autorización
- **Nodemailer** - Sistema de notificaciones por email

## Notas

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

## Personalización

- **Colores y tema:** Edita variables en `/src/styles/index.css`
- **Roles adicionales:** Modifica la configuración en `/src/services/authService.js`
- **Tipos de eventos:** Personaliza categorías en `/src/components/Calendar/Calendar.jsx`
- **Textos e idioma:** Los strings están en los componentes (próximo paso: i18n)

## Contribución y Contacto

Este es un proyecto personal en **desarrollo activo continuo**. Si estás interesado en colaborar, tienes sugerencias, feedback sobre UX/UI o quieres implementar algo similar en tu institución educativa, toda contribución es bienvenida.

### Áreas de Desarrollo Activo

**Frontend:**
- [ ] Componentes avanzados y features
- [ ] Mejoras de accesibilidad y UX
- [ ] Optimización y code splitting
- [ ] Sistema de notificaciones
- [ ] Tematización
- [ ] Suite de tests completa

**Backend:**
- [ ] API REST y servicios
- [ ] Capa de persistencia
- [ ] Autenticación y autorización
- [ ] Sistema de notificaciones
- [ ] Gestión de recursos
- [ ] Logging y monitoreo

**DevOps:**
- [ ] Pipeline CI/CD
- [ ] Infraestructura cloud
- [ ] Monitoreo de producción
- [ ] Documentación técnica

## Licencia

Este proyecto está en desarrollo y es de uso educativo. Los derechos de uso para instituciones educativas reales se definirán una vez completada la implementación.

---

**Desarrollado con la visión de mejorar la comunicación y organización en escuelas internacionales** 🎓✨
