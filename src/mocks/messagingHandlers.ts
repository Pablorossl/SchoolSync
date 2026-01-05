import { http, HttpResponse, delay } from 'msw'
import { mockDb } from './authHandlers'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Helper: Validar token (simplificada)
const validateToken = (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null
  const token = authHeader.replace('Bearer ', '')
  const userId = mockDb.tokens.get(token)
  return userId ? mockDb.users.find(u => u.id === userId) : null
}

// Handler: Get Conversations
const getConversationsHandler = http.get(`${API_URL}/conversations`, async ({ request }) => {
  await delay(200)
  
  const user = validateToken(request.headers.get('Authorization'))
  if (!user) {
    return HttpResponse.json({ message: 'No autorizado' }, { status: 401 })
  }
  
  // Filtrar conversaciones donde el usuario es participante
  const userConversations = mockDb.conversations.filter(conv =>
    conv.participants.includes(user.id)
  )
  
  return HttpResponse.json(userConversations)
})

// Handler: Create Conversation
const createConversationHandler = http.post(`${API_URL}/conversations`, async ({ request }) => {
  await delay(300)
  
  const user = validateToken(request.headers.get('Authorization'))
  if (!user) {
    return HttpResponse.json({ message: 'No autorizado' }, { status: 401 })
  }
  
  const { recipientId, subject, eventId, eventTitle } = await request.json()
  
  const newConversation = {
    id: `conv_${Date.now()}`,
    participants: [user.id, String(recipientId)],
    subject,
    eventId: eventId || null,
    eventTitle: eventTitle || null,
    lastMessage: null,
    lastMessageDate: null,
    unreadBy: {},
    createdAt: new Date().toISOString()
  }
  
  mockDb.conversations.push(newConversation)
  mockDb.messages[newConversation.id] = []
  
  return HttpResponse.json(newConversation, { status: 201 })
})

// Handler: Get Messages
const getMessagesHandler = http.get(`${API_URL}/conversations/:id/messages`, async ({ request, params }) => {
  await delay(200)
  
  const user = validateToken(request.headers.get('Authorization'))
  if (!user) {
    return HttpResponse.json({ message: 'No autorizado' }, { status: 401 })
  }
  
  const { id } = params
  const conversation = mockDb.conversations.find(c => c.id === id)
  
  if (!conversation) {
    return HttpResponse.json({ message: 'Conversación no encontrada' }, { status: 404 })
  }
  
  if (!conversation.participants.includes(user.id)) {
    return HttpResponse.json({ message: 'Acceso denegado' }, { status: 403 })
  }
  
  const messages = mockDb.messages[id] || []
  return HttpResponse.json(messages)
})

// Handler: Send Message
const sendMessageHandler = http.post(`${API_URL}/conversations/:id/messages`, async ({ request, params }) => {
  await delay(300)
  
  const user = validateToken(request.headers.get('Authorization'))
  if (!user) {
    return HttpResponse.json({ message: 'No autorizado' }, { status: 401 })
  }
  
  const { id } = params
  const { content } = await request.json()
  
  const conversation = mockDb.conversations.find(c => c.id === id)
  
  if (!conversation) {
    return HttpResponse.json({ message: 'Conversación no encontrada' }, { status: 404 })
  }
  
  if (!conversation.participants.includes(user.id)) {
    return HttpResponse.json({ message: 'Acceso denegado' }, { status: 403 })
  }
  
  const newMessage = {
    id: `msg_${Date.now()}`,
    conversationId: id,
    senderId: user.id,
    senderName: user.name,
    senderRole: user.role,
    content,
    timestamp: new Date().toISOString()
  }
  
  if (!mockDb.messages[id]) {
    mockDb.messages[id] = []
  }
  mockDb.messages[id].push(newMessage)
  
  // Actualizar conversación
  conversation.lastMessage = content
  conversation.lastMessageDate = newMessage.timestamp
  
  // Incrementar unread para otros participantes
  conversation.participants.forEach(participantId => {
    if (participantId !== user.id) {
      conversation.unreadBy[participantId] = (conversation.unreadBy[participantId] || 0) + 1
    }
  })
  
  return HttpResponse.json(newMessage, { status: 201 })
})

// Handler: Mark as Read
const markAsReadHandler = http.post(`${API_URL}/conversations/:id/read`, async ({ request, params }) => {
  await delay(100)
  
  const user = validateToken(request.headers.get('Authorization'))
  if (!user) {
    return HttpResponse.json({ message: 'No autorizado' }, { status: 401 })
  }
  
  const { id } = params
  const conversation = mockDb.conversations.find(c => c.id === id)
  
  if (!conversation) {
    return HttpResponse.json({ message: 'Conversación no encontrada' }, { status: 404 })
  }
  
  if (!conversation.participants.includes(user.id)) {
    return HttpResponse.json({ message: 'Acceso denegado' }, { status: 403 })
  }
  
  // Marcar como leído
  delete conversation.unreadBy[user.id]
  
  return HttpResponse.json({ message: 'Marcado como leído' })
})

// Handler: Search Users
const searchUsersHandler = http.get(`${API_URL}/users/search`, async ({ request }) => {
  await delay(200)
  
  const user = validateToken(request.headers.get('Authorization'))
  if (!user) {
    return HttpResponse.json({ message: 'No autorizado' }, { status: 401 })
  }
  
  const url = new URL(request.url)
  const query = url.searchParams.get('q')?.toLowerCase() || ''
  
  // Buscar usuarios (excepto el actual)
  const results = mockDb.users
    .filter(u => u.id !== user.id && (
      u.name.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query)
    ))
    .map(({ password, ...userWithoutPassword }) => userWithoutPassword)
  
  return HttpResponse.json(results)
})

export const messagingHandlers = [
  getConversationsHandler,
  createConversationHandler,
  getMessagesHandler,
  sendMessageHandler,
  markAsReadHandler,
  searchUsersHandler
]
