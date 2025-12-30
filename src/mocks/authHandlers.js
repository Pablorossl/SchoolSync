import { http, HttpResponse, delay } from 'msw'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Base de datos mock en memoria
let mockDb = {
  users: [
    { id: '1', email: 'profesor@schoolsync.com', password: 'profesor123', name: 'James Kennedy', role: 'teacher' },
    { id: '2', email: 'padre@schoolsync.com', password: 'padre123', name: 'Pablo Rosales', role: 'parent' },
  ],
  events: [
    {
      id: 'event_1',
      title: 'Entrega trabajo matemáticas',
      description: 'Entregar ejercicios del capítulo 5',
      type: 'task',
      start: '2025-01-15',
      end: '2025-01-15',
      createdAt: '2025-12-20T10:00:00.000Z'
    },
    {
      id: 'event_2',
      title: 'Examen de lengua',
      description: null,
      type: 'exam',
      start: '2025-01-20',
      end: null,
      createdAt: '2025-12-22T14:30:00.000Z'
    }
  ],
  conversations: [
    {
      id: 'conv_sample_1',
      participants: ['1', '2'],
      subject: 'Consulta sobre tareas',
      eventId: null,
      eventTitle: null,
      lastMessage: 'Hola, tengo una pregunta sobre las tareas de esta semana',
      lastMessageDate: '2025-12-28T10:00:00.000Z',
      unreadBy: { '2': 1 },
      createdAt: '2025-12-28T10:00:00.000Z'
    }
  ],
  messages: {
    conv_sample_1: [
      {
        id: 'msg_sample_1',
        conversationId: 'conv_sample_1',
        senderId: '2',
        senderName: 'Pablo Rosales',
        senderRole: 'parent',
        content: 'Hola, tengo una pregunta sobre las tareas de esta semana',
        timestamp: '2025-12-28T10:00:00.000Z'
      },
      {
        id: 'msg_sample_2',
        conversationId: 'conv_sample_1',
        senderId: '1',
        senderName: 'James Kennedy',
        senderRole: 'teacher',
        content: 'Hola Pablo, claro que sí. ¿Qué necesitas saber?',
        timestamp: '2025-12-28T10:05:00.000Z'
      }
    ]
  },
  tokens: new Map() // userId -> token
}

// Helper: Generar token simple (no usar en producción)
const generateToken = (userId) => {
  const token = `mock_token_${userId}_${Date.now()}`
  mockDb.tokens.set(token, userId)
  return token
}

// Helper: Validar token
const validateToken = (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  const token = authHeader.replace('Bearer ', '')
  const userId = mockDb.tokens.get(token)
  return userId ? mockDb.users.find(u => u.id === userId) : null
}

// Handler: Login
const loginHandler = http.post(`${API_URL}/auth/login`, async ({ request }) => {
  await delay(300) // Simular latencia de red
  
  const { email, password } = await request.json()
  
  const user = mockDb.users.find(u => u.email === email && u.password === password)
  
  if (!user) {
    return HttpResponse.json(
      { message: 'Credenciales inválidas' },
      { status: 401 }
    )
  }
  
  const { password: _, ...userWithoutPassword } = user
  const token = generateToken(user.id)
  
  return HttpResponse.json({
    user: userWithoutPassword,
    token
  })
})

// Handler: Register
const registerHandler = http.post(`${API_URL}/auth/register`, async ({ request }) => {
  await delay(300)
  
  const { email, password, name, role } = await request.json()
  
  if (mockDb.users.some(u => u.email === email)) {
    return HttpResponse.json(
      { message: 'El email ya está registrado' },
      { status: 400 }
    )
  }
  
  const newUser = {
    id: String(mockDb.users.length + 1),
    email,
    password,
    name,
    role
  }
  
  mockDb.users.push(newUser)
  
  const { password: _, ...userWithoutPassword } = newUser
  const token = generateToken(newUser.id)
  
  return HttpResponse.json({
    user: userWithoutPassword,
    token
  }, { status: 201 })
})

// Handler: Verify Token
const verifyHandler = http.get(`${API_URL}/auth/verify`, async ({ request }) => {
  await delay(100)
  
  const user = validateToken(request.headers.get('Authorization'))
  
  if (!user) {
    return HttpResponse.json(
      { message: 'Token inválido o expirado' },
      { status: 401 }
    )
  }
  
  const { password: _, ...userWithoutPassword } = user
  return HttpResponse.json(userWithoutPassword)
})

// Handler: Logout
const logoutHandler = http.post(`${API_URL}/auth/logout`, async ({ request }) => {
  await delay(100)
  
  const authHeader = request.headers.get('Authorization')
  if (authHeader) {
    const token = authHeader.replace('Bearer ', '')
    mockDb.tokens.delete(token)
  }
  
  return HttpResponse.json({ message: 'Sesión cerrada correctamente' })
})

export const authHandlers = [
  loginHandler,
  registerHandler,
  verifyHandler,
  logoutHandler
]

export { mockDb }
