import { STORAGE_KEYS } from '../constants/ui'
import { getUserById, MOCK_EVENT_TITLES, type MockUser } from '../constants/mockData'

/**
 * Tipos e interfaces para el servicio de mensajería
 */
export interface Message {
  id: string
  conversationId: string
  senderId: string
  senderName: string
  senderRole: string
  content: string
  timestamp: string
}

export interface Conversation {
  id: string
  participants: string[]
  subject: string
  eventId: string | null
  eventTitle: string | null
  lastMessage: string
  lastMessageDate: string
  unreadBy: Record<string, number>
  createdAt: string
}

export interface ConversationWithDetails extends Conversation {
  participantId?: string
  participantName: string
  participantRole: string
  unreadCount?: number
}

export interface SendMessageData {
  conversationId: string
  content: string
}

export interface CreateConversationData {
  recipientId: string
  subject: string
  eventId?: string
}

interface StoredMessages {
  [conversationId: string]: Message[]
}

/**
 * NOTA: Este servicio utiliza localStorage para persistir mensajes en desarrollo.
 * Cuando el backend esté listo. Reemplazar estas funciones con llamadas
 * reales a la API usando apiClient.
 */

// Obtener usuario actual del localStorage
const getCurrentUser = (): MockUser | null => {
  try {
    const userStr = localStorage.getItem('schoolsync_user')
    return userStr ? JSON.parse(userStr) : null
  } catch {
    return null
  }
}

// Obtener conversaciones del localStorage
const getStoredConversations = (): Conversation[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

// Guardar conversaciones en localStorage
const saveConversations = (conversations: Conversation[]): void => {
  localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations))
}

// Obtener mensajes del localStorage
const getStoredMessages = (): StoredMessages => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.MESSAGES)
    return data ? JSON.parse(data) : {}
  } catch {
    return {}
  }
}

// Guardar mensajes en localStorage
const saveMessages = (messages: StoredMessages): void => {
  localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages))
}

// Simular delay de red
const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms))

// Inicializar datos de ejemplo (solo la primera vez)
const initializeSampleData = (): void => {
  const conversations = getStoredConversations()
  if (conversations.length === 0) {
    // Crear conversación de ejemplo entre profesor (id='1') y padre (id='2')
    const sampleConversation: Conversation = {
      id: 'conv_sample_1',
      participants: ['1', '2'],
      subject: 'Consulta sobre tareas',
      eventId: null,
      eventTitle: null,
      lastMessage: 'Hola, tengo una pregunta sobre las tareas de esta semana',
      lastMessageDate: new Date('2025-12-28T10:00:00').toISOString(),
      unreadBy: {},
      createdAt: new Date('2025-12-28T10:00:00').toISOString(),
    }
    
    saveConversations([sampleConversation])
    
    const sampleMessages: StoredMessages = {
      conv_sample_1: [
        {
          id: 'msg_sample_1',
          conversationId: 'conv_sample_1',
          senderId: '2',
          senderName: 'Pablo Rosales',
          senderRole: 'parent',
          content: 'Hola, tengo una pregunta sobre las tareas de esta semana',
          timestamp: new Date('2025-12-28T10:00:00').toISOString(),
        },
        {
          id: 'msg_sample_2',
          conversationId: 'conv_sample_1',
          senderId: '1',
          senderName: 'James Kennedy',
          senderRole: 'teacher',
          content: 'Hola Pablo, claro que sí. ¿Qué necesitas saber?',
          timestamp: new Date('2025-12-28T10:05:00').toISOString(),
        }
      ]
    }
    
    saveMessages(sampleMessages)
  }
}

// Inicializar al cargar el módulo
initializeSampleData()

/**
 * Obtener todas las conversaciones del usuario actual
 */
export const getConversations = async (): Promise<ConversationWithDetails[]> => {
  // TODO: BACKEND - Reemplazar con llamada real a la API
  // return await apiClient.get('/messaging/conversations')
  
  await delay(300)
  
  const currentUser = getCurrentUser()
  if (!currentUser) return []
  
  const allConversations = getStoredConversations()
  const currentUserId = String(currentUser.id) // Normalizar a string
  
  // Filtrar conversaciones donde el usuario actual es participante
  const userConversations = allConversations
    .filter(conv => {
      return conv.participants.some(p => String(p) === currentUserId)
    })
    .map(conv => {
      // Obtener información del otro participante
      const otherParticipantId = conv.participants.find(
        p => String(p) !== currentUserId
      )
      const otherUser = otherParticipantId ? getUserById(otherParticipantId) : null
      
      return {
        ...conv,
        participantId: otherParticipantId,
        participantName: otherUser?.name || 'Usuario desconocido',
        participantRole: otherUser?.role || 'unknown',
        lastMessageDate: conv.lastMessageDate,
      }
    })
    .sort((a, b) => new Date(b.lastMessageDate).getTime() - new Date(a.lastMessageDate).getTime())
  
  return userConversations
}

/**
 * Obtener mensajes de una conversación específica
 */
export const getMessages = async (conversationId: string): Promise<Message[]> => {
  // TODO: BACKEND - Reemplazar con llamada real a la API
  // return await apiClient.get(`/messaging/conversations/${conversationId}/messages`)
  
  await delay(200)
  
  const allMessages = getStoredMessages()
  const messages = allMessages[conversationId] || []
  
  return messages
}

/**
 * Enviar un nuevo mensaje en una conversación
 */
export const sendMessage = async ({ conversationId, content }: SendMessageData): Promise<Message> => {
  // TODO: BACKEND - Reemplazar con llamada real a la API
  // return await apiClient.post(`/messaging/conversations/${conversationId}/messages`, {
  //   content
  // })
  
  await delay(300)
  
  const currentUser = getCurrentUser()
  if (!currentUser) throw new Error('Usuario no autenticado')
  
  const allMessages = getStoredMessages()
  const allConversations = getStoredConversations()
  const currentUserId = String(currentUser.id) // Normalizar a string
  
  const newMessage = {
    id: `msg_${conversationId}_${Date.now()}`,
    conversationId,
    senderId: currentUserId,
    senderName: currentUser.name,
    senderRole: currentUser.role,
    content,
    timestamp: new Date().toISOString(),
  }
  
  // Agregar mensaje
  if (!allMessages[conversationId]) {
    allMessages[conversationId] = []
  }
  allMessages[conversationId].push(newMessage)
  saveMessages(allMessages)
  
  // Actualizar última actividad de la conversación
  const convIndex = allConversations.findIndex(c => c.id === conversationId)
  if (convIndex !== -1) {
    allConversations[convIndex].lastMessage = content
    allConversations[convIndex].lastMessageDate = new Date().toISOString()
    
    // Incrementar contador de no leídos para el otro participante
    const otherParticipantId = allConversations[convIndex].participants.find(
      p => String(p) !== currentUserId
    )
    if (!allConversations[convIndex].unreadBy) {
      allConversations[convIndex].unreadBy = {}
    }
    const normalizedOtherId = String(otherParticipantId)
    allConversations[convIndex].unreadBy[normalizedOtherId] = 
      (allConversations[convIndex].unreadBy[normalizedOtherId] || 0) + 1
    
    saveConversations(allConversations)
  }
  
  return newMessage
}

/**
 * Crear una nueva conversación
 */
export const createConversation = async ({ recipientId, subject, eventId }: CreateConversationData): Promise<ConversationWithDetails> => {
  // TODO: BACKEND - Reemplazar con llamada real a la API
  // return await apiClient.post('/messaging/conversations', {
  //   recipientId,
  //   subject,
  //   eventId
  // })
  
  await delay(400)
  
  const currentUser = getCurrentUser()
  if (!currentUser) throw new Error('Usuario no autenticado')
  
  const currentUserId = String(currentUser.id) // Normalizar a string
  const normalizedRecipientId = String(recipientId) // Normalizar a string
  
  const recipient = getUserById(normalizedRecipientId)
  if (!recipient) throw new Error('Destinatario no encontrado')
  
  const allConversations = getStoredConversations()
  
  const newConversation = {
    id: `conv_${Date.now()}`,
    participants: [currentUserId, normalizedRecipientId],
    subject,
    eventId: eventId || null,
    eventTitle: eventId ? MOCK_EVENT_TITLES[eventId] : null,
    lastMessage: '',
    lastMessageDate: new Date().toISOString(),
    unreadBy: {},
    createdAt: new Date().toISOString(),
  }
  
  allConversations.push(newConversation)
  saveConversations(allConversations)
  
  // Inicializar mensajes vacíos
  const allMessages = getStoredMessages()
  allMessages[newConversation.id] = []
  saveMessages(allMessages)
  
  return {
    ...newConversation,
    participantId: normalizedRecipientId,
    participantName: recipient.name,
    participantRole: recipient.role,
    unreadCount: 0,
  }
}

/**
 * Marcar mensajes de una conversación como leídos
 */
export const markAsRead = async (conversationId: string): Promise<void> => {
  // TODO: BACKEND - Reemplazar con llamada real a la API
  // return await apiClient.put(`/messaging/conversations/${conversationId}/read`)
  
  await delay(100)
  
  const currentUser = getCurrentUser()
  if (!currentUser) return
  
  const currentUserId = String(currentUser.id) // Normalizar a string
  const allConversations = getStoredConversations()
  const convIndex = allConversations.findIndex(c => c.id === conversationId)
  
  if (convIndex !== -1) {
    if (!allConversations[convIndex].unreadBy) {
      allConversations[convIndex].unreadBy = {}
    }
    allConversations[convIndex].unreadBy[currentUserId] = 0
    saveConversations(allConversations)
  }
}

/**
 * Obtener conversaciones relacionadas con un evento específico
 */
export const getConversationsByEvent = async (eventId: string): Promise<ConversationWithDetails[]> => {
  // TODO: BACKEND - Reemplazar con llamada real a la API
  // return await apiClient.get(`/messaging/conversations?eventId=${eventId}`)
  
  await delay(200)
  
  const currentUser = getCurrentUser()
  if (!currentUser) return []
  
  const currentUserId = String(currentUser.id) // Normalizar a string
  const allConversations = getStoredConversations()
  
  return allConversations
    .filter(conv => {
      const isParticipant = conv.participants.some(p => String(p) === currentUserId)
      return isParticipant && conv.eventId === eventId
    })
    .map(conv => {
      const otherParticipantId = conv.participants.find(
        p => String(p) !== currentUserId
      )
      const otherUser = otherParticipantId ? getUserById(otherParticipantId) : null
      
      return {
        ...conv,
        participantId: otherParticipantId,
        participantName: otherUser?.name || 'Usuario desconocido',
        participantRole: otherUser?.role || 'unknown',
      }
    })
}

/**
 * Eliminar una conversación
 */
export const deleteConversation = async (conversationId: string): Promise<void> => {
  // TODO: BACKEND - Reemplazar con llamada real a la API
  // return await apiClient.delete(`/messaging/conversations/${conversationId}`)
  
  await delay(200)
  
  const allConversations = getStoredConversations()
  const allMessages = getStoredMessages()
  
  const index = allConversations.findIndex(c => c.id === conversationId)
  if (index !== -1) {
    allConversations.splice(index, 1)
    saveConversations(allConversations)
  }
  
  delete allMessages[conversationId]
  saveMessages(allMessages)
}

interface SearchResults {
  conversations: ConversationWithDetails[]
  messages: Message[]
}

/**
 * Buscar conversaciones y mensajes
 */
export const searchMessages = async (query: string): Promise<SearchResults> => {
  // TODO: BACKEND - Reemplazar con llamada real a la API
  // return await apiClient.get(`/messaging/search?q=${encodeURIComponent(query)}`)
  
  await delay(300)
  
  const currentUser = getCurrentUser()
  if (!currentUser) return { conversations: [], messages: [] }
  
  const currentUserId = String(currentUser.id) // Normalizar a string
  const lowerQuery = query.toLowerCase()
  const allConversations = getStoredConversations()
  const allMessages = getStoredMessages()
  
  // Filtrar conversaciones del usuario actual
  const userConversations = allConversations.filter(conv => 
    conv.participants.some(p => String(p) === currentUserId)
  )
  
  // Buscar en conversaciones
  const conversationResults = userConversations
    .filter(conv =>
      conv.subject.toLowerCase().includes(lowerQuery) ||
      conv.lastMessage.toLowerCase().includes(lowerQuery)
    )
    .map(conv => {
      const otherParticipantId = conv.participants.find(
        p => String(p) !== currentUserId
      )
      const otherUser = otherParticipantId ? getUserById(otherParticipantId) : null
      
      return {
        ...conv,
        participantName: otherUser?.name || 'Usuario desconocido',
        participantRole: otherUser?.role || 'unknown',
      }
    })
  
  // Buscar en mensajes
  const messageResults: Message[] = []
  Object.entries(allMessages).forEach(([convId, messages]) => {
    const conv = userConversations.find(c => c.id === convId)
    if (conv) {
      messages.forEach(msg => {
        if (msg.content.toLowerCase().includes(lowerQuery)) {
          messageResults.push(msg)
        }
      })
    }
  })
  
  return {
    conversations: conversationResults,
    messages: messageResults,
  }
}

/**
 * Limpiar todos los datos de mensajería (útil para desarrollo)
 */
export const clearAllMessagingData = (): void => {
  localStorage.removeItem(STORAGE_KEYS.CONVERSATIONS)
  localStorage.removeItem(STORAGE_KEYS.MESSAGES)
  initializeSampleData()
}
