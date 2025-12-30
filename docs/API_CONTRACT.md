# API Contract - SchoolSync Backend

> **Para el desarrollador backend**: Este documento especifica el contrato completo de la API que el frontend espera. Implementa estos endpoints para que el sistema funcione end-to-end.

## Base URL

```
Desarrollo: http://localhost:5000/api
Producción: https://api.schoolsync.com/api
```

## Autenticación

Todos los endpoints protegidos requieren un token JWT en el header:
```
Authorization: Bearer <token>
```

---

## 📋 Índice de Endpoints

### Autenticación
- [POST /auth/login](#post-authlogin) - Iniciar sesión
- [POST /auth/register](#post-authregister) - Registrar usuario
- [GET /auth/verify](#get-authverify) - Verificar token
- [POST /auth/logout](#post-authlogout) - Cerrar sesión

### Mensajería
- [GET /messaging/conversations](#get-messagingconversations) - Obtener conversaciones del usuario
- [GET /messaging/conversations/:id/messages](#get-messagingconversationsidmessages) - Obtener mensajes
- [POST /messaging/conversations](#post-messagingconversations) - Crear conversación
- [POST /messaging/conversations/:id/messages](#post-messagingconversationsidmessages) - Enviar mensaje
- [PUT /messaging/conversations/:id/read](#put-messagingconversationsidread) - Marcar como leído
- [GET /messaging/conversations?eventId=:id](#get-messagingconversationseventid) - Conversaciones por evento
- [DELETE /messaging/conversations/:id](#delete-messagingconversationsid) - Eliminar conversación
- [GET /messaging/search?q=:query](#get-messagingsearchqquery) - Buscar mensajes

### Calendario
- [GET /events](#get-events) - Obtener todos los eventos
- [POST /events](#post-events) - Crear evento
- [PUT /events/:id](#put-eventsid) - Actualizar evento
- [DELETE /events/:id](#delete-eventsid) - Eliminar evento

---

## 🔐 Autenticación

### POST /auth/login

Autentica un usuario y devuelve un token JWT.

**Request:**
```json
{
  "email": "profesor@schoolsync.com",
  "password": "profesor123"
}
```

**Response 200:**
```json
{
  "user": {
    "id": "1",
    "email": "profesor@schoolsync.com",
    "name": "James Kennedy",
    "role": "teacher"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 401:**
```json
{
  "message": "Credenciales inválidas"
}
```

**Notas:**
- IDs deben ser strings
- `role` puede ser: `"teacher"` o `"parent"`
- Token expira en 24h (configurable)

---

### POST /auth/register

Registra un nuevo usuario.

**Request:**
```json
{
  "email": "nuevo@schoolsync.com",
  "password": "password123",
  "name": "María López",
  "role": "parent"
}
```

**Response 201:**
```json
{
  "user": {
    "id": "3",
    "email": "nuevo@schoolsync.com",
    "name": "María López",
    "role": "parent"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 400:**
```json
{
  "message": "El email ya está registrado"
}
```

---

### GET /auth/verify

Verifica si un token es válido y devuelve los datos del usuario.

**Headers:**
```
Authorization: Bearer <token>
```

**Response 200:**
```json
{
  "id": "1",
  "email": "profesor@schoolsync.com",
  "name": "James Kennedy",
  "role": "teacher"
}
```

**Response 401:**
```json
{
  "message": "Token inválido o expirado"
}
```

---

### POST /auth/logout

Invalida el token actual (opcional - puede manejarse solo en frontend).

**Headers:**
```
Authorization: Bearer <token>
```

**Response 200:**
```json
{
  "message": "Sesión cerrada correctamente"
}
```

---

## 💬 Mensajería

### GET /messaging/conversations

Obtiene todas las conversaciones del usuario autenticado.

**Headers:**
```
Authorization: Bearer <token>
```

**Response 200:**
```json
[
  {
    "id": "conv_123",
    "participants": ["1", "2"],
    "subject": "Consulta sobre tareas",
    "eventId": "event_1",
    "eventTitle": "📝 Entrega trabajo matemáticas",
    "lastMessage": "Hola, tengo una pregunta...",
    "lastMessageDate": "2025-12-28T10:00:00.000Z",
    "unreadBy": {
      "2": 3
    },
    "createdAt": "2025-12-28T10:00:00.000Z"
  }
]
```

**Notas:**
- Filtrar conversaciones donde el usuario autenticado esté en `participants`
- `unreadBy` es un objeto: `{ "userId": cantidadNoLeidos }`
- `eventId` y `eventTitle` son opcionales (null si no está relacionado a evento)
- Ordenar por `lastMessageDate` DESC

---

### GET /messaging/conversations/:id/messages

Obtiene todos los mensajes de una conversación específica.

**Headers:**
```
Authorization: Bearer <token>
```

**Response 200:**
```json
[
  {
    "id": "msg_123",
    "conversationId": "conv_123",
    "senderId": "2",
    "senderName": "Pablo Rosales",
    "senderRole": "parent",
    "content": "Hola, tengo una pregunta sobre las tareas",
    "timestamp": "2025-12-28T10:00:00.000Z"
  },
  {
    "id": "msg_124",
    "conversationId": "conv_123",
    "senderId": "1",
    "senderName": "James Kennedy",
    "senderRole": "teacher",
    "content": "Claro, dime",
    "timestamp": "2025-12-28T10:05:00.000Z"
  }
]
```

**Response 403:**
```json
{
  "message": "No tienes acceso a esta conversación"
}
```

**Notas:**
- Verificar que el usuario autenticado sea participante de la conversación
- Ordenar por `timestamp` ASC (más antiguo primero)

---

### POST /messaging/conversations

Crea una nueva conversación.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "recipientId": "2",
  "subject": "Consulta sobre examen",
  "eventId": "event_2"
}
```

**Response 201:**
```json
{
  "id": "conv_456",
  "participants": ["1", "2"],
  "subject": "Consulta sobre examen",
  "eventId": "event_2",
  "eventTitle": "📚 Examen de lengua",
  "lastMessage": "",
  "lastMessageDate": "2025-12-30T12:00:00.000Z",
  "unreadBy": {},
  "createdAt": "2025-12-30T12:00:00.000Z"
}
```

**Response 400:**
```json
{
  "message": "El recipientId es requerido"
}
```

**Response 404:**
```json
{
  "message": "Usuario destinatario no encontrado"
}
```

**Notas:**
- `participants` debe incluir al usuario autenticado y al `recipientId`
- `eventId` es opcional
- Si `eventId` existe, obtener el título del evento y agregarlo

---

### POST /messaging/conversations/:id/messages

Envía un mensaje en una conversación.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "content": "Gracias por la información"
}
```

**Response 201:**
```json
{
  "id": "msg_789",
  "conversationId": "conv_123",
  "senderId": "1",
  "senderName": "James Kennedy",
  "senderRole": "teacher",
  "content": "Gracias por la información",
  "timestamp": "2025-12-30T12:30:00.000Z"
}
```

**Response 403:**
```json
{
  "message": "No tienes acceso a esta conversación"
}
```

**Lógica adicional:**
- Actualizar `lastMessage` y `lastMessageDate` de la conversación
- Incrementar `unreadBy[otroParticipanteId]` en la conversación
- Notificar en tiempo real (WebSocket opcional)

---

### PUT /messaging/conversations/:id/read

Marca todos los mensajes de una conversación como leídos para el usuario autenticado.

**Headers:**
```
Authorization: Bearer <token>
```

**Response 200:**
```json
{
  "message": "Mensajes marcados como leídos"
}
```

**Lógica:**
- Resetear `unreadBy[userId]` a 0 en la conversación

---

### GET /messaging/conversations?eventId=:id

Obtiene conversaciones relacionadas con un evento específico.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Params:**
- `eventId` (required): ID del evento

**Response 200:**
```json
[
  {
    "id": "conv_123",
    "participants": ["1", "2"],
    "subject": "Sobre el trabajo",
    "eventId": "event_1",
    "eventTitle": "📝 Entrega trabajo matemáticas",
    "lastMessage": "¿Cuándo es la entrega?",
    "lastMessageDate": "2025-12-29T10:00:00.000Z",
    "unreadBy": {},
    "createdAt": "2025-12-28T10:00:00.000Z"
  }
]
```

**Notas:**
- Filtrar por `eventId` y que el usuario autenticado sea participante

---

### DELETE /messaging/conversations/:id

Elimina una conversación y todos sus mensajes.

**Headers:**
```
Authorization: Bearer <token>
```

**Response 200:**
```json
{
  "message": "Conversación eliminada"
}
```

**Response 403:**
```json
{
  "message": "No tienes permiso para eliminar esta conversación"
}
```

**Notas:**
- Solo permitir si el usuario es participante
- Eliminar en cascada todos los mensajes asociados

---

### GET /messaging/search?q=:query

Busca conversaciones y mensajes por término.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Params:**
- `q` (required): Término de búsqueda

**Response 200:**
```json
{
  "conversations": [
    {
      "id": "conv_123",
      "subject": "Consulta sobre tareas",
      "participantName": "Pablo Rosales",
      "lastMessage": "Hola, tengo una pregunta...",
      "lastMessageDate": "2025-12-28T10:00:00.000Z"
    }
  ],
  "messages": [
    {
      "id": "msg_456",
      "conversationId": "conv_789",
      "senderName": "James Kennedy",
      "content": "Las tareas se entregan el viernes",
      "timestamp": "2025-12-29T15:00:00.000Z"
    }
  ]
}
```

**Notas:**
- Buscar en `subject` de conversaciones y `content` de mensajes
- Solo resultados donde el usuario sea participante
- Case-insensitive

---

## 📅 Calendario

### GET /events

Obtiene todos los eventos del calendario.

**Headers:**
```
Authorization: Bearer <token>
```

**Response 200:**
```json
[
  {
    "id": "event_1",
    "title": "Entrega trabajo matemáticas",
    "description": "Entregar ejercicios del capítulo 5",
    "type": "task",
    "start": "2025-01-15",
    "end": "2025-01-15",
    "createdAt": "2025-12-20T10:00:00.000Z"
  },
  {
    "id": "event_2",
    "title": "Examen de lengua",
    "description": null,
    "type": "exam",
    "start": "2025-01-20",
    "end": null,
    "createdAt": "2025-12-22T14:30:00.000Z"
  }
]
```

**Notas:**
- `type` puede ser: `"task"`, `"exam"`, `"note"`, `"event"`
- `description` y `end` son opcionales (null)
- Filtrar por rol si es necesario (padres ven todos, profesores pueden editar)

---

### POST /events

Crea un nuevo evento en el calendario.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "title": "Excursión al museo",
  "description": "Salida educativa al museo de ciencias",
  "type": "event",
  "start": "2025-02-10",
  "end": "2025-02-10"
}
```

**Response 201:**
```json
{
  "id": "event_3",
  "title": "Excursión al museo",
  "description": "Salida educativa al museo de ciencias",
  "type": "event",
  "start": "2025-02-10",
  "end": "2025-02-10",
  "createdAt": "2025-12-30T13:00:00.000Z"
}
```

**Response 400:**
```json
{
  "message": "El título y la fecha son requeridos"
}
```

**Response 403:**
```json
{
  "message": "Solo los profesores pueden crear eventos"
}
```

**Notas:**
- Solo usuarios con rol `teacher` pueden crear
- Validar que `start` no sea fecha pasada
- `end` opcional, si no se provee es igual a `start`

---

### PUT /events/:id

Actualiza un evento existente.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "title": "Excursión al museo (actualizado)",
  "description": "Nueva descripción",
  "type": "event",
  "start": "2025-02-12",
  "end": "2025-02-12"
}
```

**Response 200:**
```json
{
  "id": "event_3",
  "title": "Excursión al museo (actualizado)",
  "description": "Nueva descripción",
  "type": "event",
  "start": "2025-02-12",
  "end": "2025-02-12",
  "createdAt": "2025-12-30T13:00:00.000Z"
}
```

**Response 403:**
```json
{
  "message": "Solo los profesores pueden editar eventos"
}
```

**Response 404:**
```json
{
  "message": "Evento no encontrado"
}
```

---

### DELETE /events/:id

Elimina un evento del calendario.

**Headers:**
```
Authorization: Bearer <token>
```

**Response 200:**
```json
{
  "message": "Evento eliminado correctamente"
}
```

**Response 403:**
```json
{
  "message": "Solo los profesores pueden eliminar eventos"
}
```

**Response 404:**
```json
{
  "message": "Evento no encontrado"
}
```

---

## 🎨 Tipos de Datos

### User
```typescript
{
  id: string           // UUID o string único
  email: string        // Único
  name: string
  role: "teacher" | "parent"
}
```

### Conversation
```typescript
{
  id: string
  participants: string[]        // Array de user IDs
  subject: string
  eventId: string | null        // Opcional
  eventTitle: string | null     // Opcional
  lastMessage: string
  lastMessageDate: string       // ISO 8601
  unreadBy: { [userId: string]: number }
  createdAt: string             // ISO 8601
}
```

### Message
```typescript
{
  id: string
  conversationId: string
  senderId: string
  senderName: string
  senderRole: "teacher" | "parent"
  content: string
  timestamp: string             // ISO 8601
}
```

### Event
```typescript
{
  id: string
  title: string
  description: string | null    // Opcional
  type: "task" | "exam" | "note" | "event"
  start: string                 // Fecha ISO (YYYY-MM-DD)
  end: string | null            // Opcional
  createdAt: string             // ISO 8601
}
```

---

## ⚠️ Códigos de Error

| Código | Descripción |
|--------|-------------|
| 400 | Bad Request - Datos inválidos |
| 401 | Unauthorized - Token faltante/inválido |
| 403 | Forbidden - Sin permisos |
| 404 | Not Found - Recurso no existe |
| 500 | Internal Server Error |

### Formato de Error Estándar
```json
{
  "message": "Descripción del error",
  "errors": [
    {
      "field": "email",
      "message": "Email inválido"
    }
  ]
}
```

---

## 🔧 Configuración Backend

### Variables de Entorno Requeridas
```env
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/schoolsync
JWT_SECRET=tu_secreto_seguro_aqui
JWT_EXPIRES_IN=24h
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### CORS
Permitir:
- `http://localhost:5173` (desarrollo)
- `https://schoolsync.com` (producción)

---

## 🚀 Implementación Sugerida

### Stack Recomendado
- **Node.js + Express** (simple y rápido)
- **PostgreSQL** (relacional, soporta JSON)
- **JWT** para autenticación
- **Socket.io** (opcional) para mensajería en tiempo real
- **Prisma/TypeORM** como ORM

### Prioridad de Implementación
1. ✅ Autenticación (login, register, verify)
2. ✅ Calendario CRUD (simple)
3. ✅ Conversaciones básicas (get, create)
4. ✅ Mensajes (get, create, markAsRead)
5. 🔶 Búsqueda (search)
6. 🔶 Tiempo real con WebSockets

### Base de Datos Schema Sugerido

```sql
-- Usuarios
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('teacher', 'parent')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Eventos
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL CHECK (type IN ('task', 'exam', 'note', 'event')),
  start_date DATE NOT NULL,
  end_date DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Conversaciones
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject VARCHAR(255) NOT NULL,
  event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  last_message TEXT DEFAULT '',
  last_message_date TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Participantes de conversaciones
CREATE TABLE conversation_participants (
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  unread_count INTEGER DEFAULT 0,
  PRIMARY KEY (conversation_id, user_id)
);

-- Mensajes
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
```

---

## 📞 Contacto Frontend

Si necesitas clarificaciones o cambios en el contrato:
- Revisa los servicios en: `src/services/`
- Tests de referencia en: `src/tests/`
- Abre un issue o contacta al equipo frontend

---

**Versión del contrato**: 1.0.0  
**Última actualización**: Diciembre 30, 2025  
**Mantenido por**: Equipo Frontend SchoolSync
