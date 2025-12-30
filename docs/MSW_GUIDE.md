# Mock Service Worker (MSW) - Guía de Uso

## ¿Qué es MSW?

Mock Service Worker es una librería que intercepta las peticiones HTTP **a nivel de navegador** y responde con datos simulados. Esto permite desarrollar el frontend de forma completamente independiente sin necesitar un backend real.

## Configuración

### 1. Habilitar el Mock Server

Edita (o crea) el archivo `.env`:

```bash
VITE_USE_MOCK_API=true
VITE_API_URL=http://localhost:5000/api
```

### 2. Ejecutar el proyecto

```bash
npm run dev
```

Deberías ver en la consola del navegador:
```
[MSW] Mocking enabled.
```

## Usuarios de prueba

El mock server viene con 2 usuarios predefinidos:

| Email                      | Password     | Rol     | Nombre         |
|----------------------------|--------------|---------|----------------|
| profesor@schoolsync.com    | profesor123  | teacher | James Kennedy  |
| padre@schoolsync.com       | padre123     | parent  | Pablo Rosales  |

## Datos iniciales

### Eventos
- **2 eventos** en el calendario con diferentes tipos (task, exam)

### Conversaciones
- **1 conversación** de ejemplo entre James Kennedy y Pablo Rosales

### Mensajes
- **2 mensajes** en la conversación de ejemplo

## Endpoints disponibles

Todos los endpoints documentados en [`docs/API_CONTRACT.md`](../docs/API_CONTRACT.md) están mockeados:

### Autenticación
- `POST /auth/login` - Login
- `POST /auth/register` - Registro
- `GET /auth/verify` - Verificar token
- `POST /auth/logout` - Cerrar sesión

### Calendario
- `GET /events` - Obtener eventos
- `POST /events` - Crear evento
- `PUT /events/:id` - Actualizar evento
- `DELETE /events/:id` - Eliminar evento

### Mensajería
- `GET /conversations` - Obtener conversaciones
- `POST /conversations` - Crear conversación
- `GET /conversations/:id/messages` - Obtener mensajes
- `POST /conversations/:id/messages` - Enviar mensaje
- `POST /conversations/:id/read` - Marcar como leído
- `GET /users/search` - Buscar usuarios

## Características

### ✅ Persistencia en memoria
- Los datos se mantienen **durante la sesión del navegador**
- Recargando la página se conservan
- Cerrando/abriendo pestañas se pierden (comportamiento en memoria)

### ✅ Latencia simulada
- Cada endpoint tiene un delay (100-300ms) para simular red real
- Mejora la experiencia de desarrollo (spinners, estados de carga)

### ✅ Validación de tokens
- Login genera un token simple
- Endpoints protegidos validan el header `Authorization: Bearer {token}`
- Respuestas 401 si el token es inválido

### ✅ Lógica de negocio
- **Unread counters**: Incrementan al recibir mensajes
- **Last message**: Se actualiza en conversaciones
- **Participantes**: Filtra conversaciones por usuario
- **Búsqueda**: Busca usuarios por nombre/email

## Estructura de archivos

```
src/mocks/
├── browser.js              # Setup de MSW
├── handlers.js             # Agrupa todos los handlers
├── authHandlers.js         # Endpoints de autenticación
├── calendarHandlers.js     # Endpoints de calendario
└── messagingHandlers.js    # Endpoints de mensajería
```

## Modificar datos iniciales

Edita el objeto `mockDb` en [`src/mocks/authHandlers.js`](../src/mocks/authHandlers.js):

```javascript
let mockDb = {
  users: [...],      // Añadir usuarios
  events: [...],     // Añadir eventos
  conversations: [...], // Añadir conversaciones
  messages: {...}    // Añadir mensajes
}
```

## Desactivar el Mock Server

### Opción 1: Variable de entorno
Edita `.env`:
```bash
VITE_USE_MOCK_API=false
```

### Opción 2: Eliminar el archivo
Borra (o renombra) `.env` para usar valores por defecto.

Recarga la página y la app intentará conectarse al backend real en `http://localhost:5000/api`.

## Integración con servicios existentes

Los servicios actuales (`authService.js`, `calendarService.js`, `messagingService.js`) **NO necesitan cambios**.

MSW intercepta las peticiones a nivel de navegador **antes** de que lleguen al servidor, por lo que:
- `apiClient.js` sigue funcionando igual
- Los componentes no saben si están hablando con MSW o backend real
- Cambiar entre mock y real es transparente

## Workflow de desarrollo

### Desarrollo sin backend (actual)
1. `VITE_USE_MOCK_API=true` en `.env`
2. Desarrollar features usando datos mockeados
3. Probar flujos completos sin dependencias

### Transición a backend real
1. Backend implementa endpoints según `API_CONTRACT.md`
2. `VITE_USE_MOCK_API=false` en `.env`
3. La app se conecta al backend real
4. Los servicios funcionan sin cambios

### Desarrollo híbrido (opcional)
Puedes combinar ambos:
- Algunos endpoints contra backend real
- Otros contra MSW (si backend no está listo)
- Modifica `handlers.js` para comentar handlers específicos

## Debugging

### Ver peticiones interceptadas
Abre DevTools → Network:
- Peticiones mockeadas tienen respuesta instantánea (+ delay simulado)
- Aparecen como peticiones normales (200, 401, etc.)

### Ver logs de MSW
En la consola del navegador:
```javascript
// MSW logueará peticiones interceptadas automáticamente
```

### Inspeccionar estado mock
En la consola del navegador:
```javascript
// Acceder a mockDb (solo para debugging)
import { mockDb } from './mocks/authHandlers.js'
console.log(mockDb)
```

## Ventajas

✅ **Desarrollo independiente**: No esperar al backend  
✅ **Testing end-to-end**: Probar flujos completos sin API real  
✅ **Offline development**: Trabajar sin conexión  
✅ **Demos y prototipos**: Mostrar features sin infraestructura  
✅ **Documentación viva**: Los mocks son ejemplos ejecutables del API_CONTRACT

## Próximos pasos

Una vez el backend esté listo:
1. Cambiar `VITE_USE_MOCK_API=false`
2. Verificar que los endpoints reales cumplen el contrato
3. Ajustar cualquier diferencia menor
4. Mantener los mocks para testing y demos

---

**Documentación relacionada:**
- [API_CONTRACT.md](../docs/API_CONTRACT.md) - Especificación completa de la API
- [README.md](../README.md) - Configuración general del proyecto
