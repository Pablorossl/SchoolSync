import apiClient from './apiClient'

/**
 * NOTA: Este servicio utiliza localStorage para persistir mensajes en desarrollo.
 * Cuando el backend esté listo. Reemplazar estas funciones con llamadas
 * reales a la API usando apiClient.
 */

// Claves de localStorage
const STORAGE_KEYS = {
  CONVERSATIONS: 'schoolsync_conversations',
  MESSAGES: 'schoolsync_messages',
}

// Usuarios disponibles del sistema (sincronizado con authService)
// NOTA: IDs normalizados a strings para evitar bugs de comparación
const AVAILABLE_USERS = [
  { id: '1', name: 'James Kennedy', role: 'teacher', email: 'profesor@schoolsync.com' },
  { id: '2', name: 'Pablo Rosales', role: 'parent', email: 'padre@schoolsync.com' },
  // Usuarios adicionales para seleccionar
  { id: 'teacher_2', name: 'Prof. Ana Sánchez', role: 'teacher', subject: 'Lengua' },
  { id: 'teacher_3', name: 'Prof. Luis Fernández', role: 'teacher', subject: 'Ciencias' },
  { id: 'parent_3', name: 'Carmen Ruiz', role: 'parent', relation: 'Madre de Luis' },
  { id: 'parent_4', name: 'María García', role: 'parent', relation: 'Madre de Juan' },
]

// Obtener usuario actual del localStorage
const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem('schoolsync_user')
    return userStr ? JSON.parse(userStr) : null
  } catch {
    return null
  }
}

// Obtener conversaciones del localStorage
const getStoredConversations = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

// Guardar conversaciones en localStorage
const saveConversations = (conversations) => {
  localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations))
}

// Obtener mensajes del localStorage
const getStoredMessages = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.MESSAGES)
    return data ? JSON.parse(data) : {}
  } catch {
    return {}
  }
}

// Guardar mensajes en localStorage
const saveMessages = (messages) => {
  localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages))
}

// Simular delay de red
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Inicializar datos de ejemplo (solo la primera vez)
const initializeSampleData = () => {
  const conversations = getStoredConversations()
  if (conversations.length === 0) {
    // Crear conversación de ejemplo entre profesor (id='1') y padre (id='2')
    const sampleConversation = {
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
    
    const sampleMessages = {
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
 * @returns {Promise<Array>} Lista de conversaciones
 */
export const getConversations = async () => {
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
      const otherUser = AVAILABLE_USERS.find(u => u.id === String(otherParticipantId))
      
      return {
        ...conv,
        participantId: otherParticipantId,
        participantName: otherUser?.name || 'Usuario desconocido',
        participantRole: otherUser?.role || 'unknown',
        lastMessageDate: new Date(conv.lastMessageDate),
      }
    })
    .sort((a, b) => new Date(b.lastMessageDate) - new Date(a.lastMessageDate))
  
  return userConversations
}

/**
 * Obtener mensajes de una conversación específica
 * @param {string} conversationId - ID de la conversación
 * @returns {Promise<Array>} Lista de mensajes
 */
export const getMessages = async (conversationId) => {
  // TODO: BACKEND - Reemplazar con llamada real a la API
  // return await apiClient.get(`/messaging/conversations/${conversationId}/messages`)
  
  await delay(200)
  
  const allMessages = getStoredMessages()
  const messages = allMessages[conversationId] || []
  
  return messages.map(msg => ({
    ...msg,
    timestamp: new Date(msg.timestamp)
  }))
}

/**
 * Enviar un nuevo mensaje en una conversación
 * @param {Object} messageData - Datos del mensaje
 * @param {string} messageData.conversationId - ID de la conversación
 * @param {string} messageData.content - Contenido del mensaje
 * @returns {Promise<Object>} Mensaje creado
 */
export const sendMessage = async ({ conversationId, content }) => {
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
  
  return {
    ...newMessage,
    timestamp: new Date(newMessage.timestamp)
  }
}

/**
 * Crear una nueva conversación
 * @param {Object} conversationData - Datos de la conversación
 * @param {string} conversationData.recipientId - ID del destinatario
 * @param {string} conversationData.subject - Asunto de la conversación
 * @param {string} [conversationData.eventId] - ID del evento relacionado (opcional)
 * @returns {Promise<Object>} Conversación creada
 */
export const createConversation = async ({ recipientId, subject, eventId }) => {
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
  
  const recipient = AVAILABLE_USERS.find(u => u.id === normalizedRecipientId)
  if (!recipient) throw new Error('Destinatario no encontrado')
  
  const allConversations = getStoredConversations()
  
  const eventTitles = {
    event_1: '📝 Entrega trabajo matemáticas',
    event_2: '📚 Examen de lengua',
    event_3: '🎨 Excursión al museo',
  }
  
  const newConversation = {
    id: `conv_${Date.now()}`,
    participants: [currentUserId, normalizedRecipientId],
    subject,
    eventId: eventId || null,
    eventTitle: eventId ? eventTitles[eventId] : null,
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
    lastMessageDate: new Date(newConversation.lastMessageDate),
  }
}

/**
 * Marcar mensajes de una conversación como leídos
 * @param {string} conversationId - ID de la conversación
 * @returns {Promise<void>}
 */
export const markAsRead = async (conversationId) => {
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
 * @param {string} eventId - ID del evento
 * @returns {Promise<Array>} Lista de conversaciones relacionadas
 */
export const getConversationsByEvent = async (eventId) => {
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
      const otherUser = AVAILABLE_USERS.find(u => u.id === String(otherParticipantId))
      
      return {
        ...conv,
        participantId: otherParticipantId,
        participantName: otherUser?.name || 'Usuario desconocido',
        participantRole: otherUser?.role || 'unknown',
        lastMessageDate: new Date(conv.lastMessageDate),
      }
    })
}

/**
 * Eliminar una conversación
 * @param {string} conversationId - ID de la conversación
 * @returns {Promise<void>}
 */
export const deleteConversation = async (conversationId) => {
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

/**
 * Buscar conversaciones y mensajes
 * @param {string} query - Término de búsqueda
 * @returns {Promise<Object>} Resultados de búsqueda
 */
export const searchMessages = async (query) => {
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
      const otherUser = AVAILABLE_USERS.find(u => u.id === String(otherParticipantId))
      
      return {
        ...conv,
        participantName: otherUser?.name || 'Usuario desconocido',
        lastMessageDate: new Date(conv.lastMessageDate),
      }
    })
  
  // Buscar en mensajes
  const messageResults = []
  Object.entries(allMessages).forEach(([convId, messages]) => {
    const conv = userConversations.find(c => c.id === convId)
    if (conv) {
      messages.forEach(msg => {
        if (msg.content.toLowerCase().includes(lowerQuery)) {
          messageResults.push({
            ...msg,
            timestamp: new Date(msg.timestamp)
          })
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
 * @returns {void}
 */
export const clearAllMessagingData = () => {
  localStorage.removeItem(STORAGE_KEYS.CONVERSATIONS)
  localStorage.removeItem(STORAGE_KEYS.MESSAGES)
  initializeSampleData()
}
