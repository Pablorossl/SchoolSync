import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import * as messagingService from '../../services/messagingService'
import { useToast } from '../../context/ToastContext'
import { useAsyncOperation, formatTimeAgo } from '../../utils/helpers'
import { USER_ROLES } from '../../constants/ui'
import logger from '../../utils/logger'
import Tooltip from '../Tooltip/Tooltip'
import './Messaging.css'

/**
 * Componente de Mensajería en Tiempo Real
 * 
 * Características:
 * - Persistencia en localStorage (simula backend)
 * - Mensajes reales entre usuarios autenticados
 * - Contador de mensajes no leídos por usuario
 * - Conversaciones asociadas a eventos del calendario
 * - Filtrado automático por usuario actual
 * 
 * Datos de ejemplo: Se inicializa automáticamente una conversación entre
 * James Kennedy (profesor) y Pablo Rosales (padre) la primera vez.
 * 
 * Para resetear datos: Ejecutar en consola:
 * import * as messagingService from './services/messagingService'
 * messagingService.clearAllMessagingData()
 */

const Messaging = ({ userRole, userId, selectedEventId = null }) => {
  const [conversations, setConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [showNewConversation, setShowNewConversation] = useState(false)
  const [showMobileMessages, setShowMobileMessages] = useState(false)
  const [newConversationData, setNewConversationData] = useState({
    recipientId: '',
    subject: '',
    eventId: selectedEventId || '',
  })
  const [sendingMessage, setSendingMessage] = useState(false)

  const toast = useToast()
  const asyncOp = useAsyncOperation()
  const isTeacher = userRole === USER_ROLES.TEACHER
  const normalizedUserId = String(userId) // Normalizar a string para consistencia

  useEffect(() => {
    loadConversations()
  }, [])

  useEffect(() => {
    if (selectedEventId && conversations.length > 0) {
      const eventConversation = conversations.find(
        conv => conv.eventId === selectedEventId
      )
      if (eventConversation) {
        handleSelectConversation(eventConversation.id)
      }
    }
  }, [selectedEventId, conversations])

  const loadConversations = async () => {
    try {
      const data = await messagingService.getConversations()
      // Calcular unreadCount para cada conversación
      const conversationsWithUnread = data.map(conv => ({
        ...conv,
        unreadCount: conv.unreadBy?.[normalizedUserId] || 0
      }))
      setConversations(conversationsWithUnread)
    } catch (error) {
      logger.error('Error cargando conversaciones:', error)
      toast.error('Error al cargar conversaciones')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectConversation = async (conversationId) => {
    const conv = conversations.find(c => c.id === conversationId)
    setSelectedConversation(conv)
    
    const msgs = await asyncOp(
      () => messagingService.getMessages(conversationId),
      'Error al cargar mensajes'
    )
    if (msgs) {
      setMessages(msgs)
      
      // Marcar mensajes como leídos
      await messagingService.markAsRead(conversationId)
      
      // Actualizar contador de no leídos
      setConversations(conversations.map(c =>
        c.id === conversationId ? { ...c, unreadCount: 0 } : c
      ))

      // En móviles, mostrar panel de mensajes
      setShowMobileMessages(true)
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedConversation) return

    setSendingMessage(true)
    const message = await asyncOp(
      () => messagingService.sendMessage({
        conversationId: selectedConversation.id,
        content: newMessage,
      }),
      'Error al enviar el mensaje'
    )

    if (message) {
      setMessages([...messages, message])
      setNewMessage('')
      toast.success('Mensaje enviado')

      // Actualizar última actividad de la conversación
      setConversations(conversations.map(c =>
        c.id === selectedConversation.id
          ? { ...c, lastMessage: newMessage, lastMessageDate: new Date() }
          : c
      ))
    }
    setSendingMessage(false)
  }

  const handleCreateConversation = async (e) => {
    e.preventDefault()
    
    if (!newConversationData.recipientId || !newConversationData.subject) {
      toast.warning('Por favor completa todos los campos')
      return
    }

    const conversation = await asyncOp(
      () => messagingService.createConversation(newConversationData),
      'Error al crear la conversación'
    )
    
    if (conversation) {
      setConversations([conversation, ...conversations])
      setShowNewConversation(false)
      setNewConversationData({
        recipientId: '',
        subject: '',
        eventId: '',
      })
      toast.success('Conversación creada correctamente')
      handleSelectConversation(conversation.id)
    }
  }

  if (loading) {
    return (
      <div className="messaging-container">
        <div className="messaging-loading" role="status" aria-live="polite">
          <div className="spinner" aria-hidden="true"></div>
          <p>Cargando mensajes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="messaging-container">
      <div className="messaging-header">
        <h2>💬 Mensajería Escolar</h2>
        <Tooltip content="Iniciar una nueva conversación" position="bottom">
          <button
            className="btn-new-conversation"
            onClick={() => setShowNewConversation(!showNewConversation)}
            aria-label="Nueva conversación"
          >
            ✉️ Nueva conversación
          </button>
        </Tooltip>
      </div>

      {showNewConversation && (
        <div className="new-conversation-modal" role="dialog" aria-labelledby="new-conversation-title" aria-modal="true">
          <div className="modal-overlay" onClick={() => setShowNewConversation(false)} aria-hidden="true"></div>
          <div className="modal-content">
            <h3 id="new-conversation-title">Nueva Conversación</h3>
            <form onSubmit={handleCreateConversation}>
              <div className="form-group">
                <label htmlFor="recipient-select">Para:</label>
                <select
                  id="recipient-select"
                  value={newConversationData.recipientId}
                  onChange={(e) => setNewConversationData({
                    ...newConversationData,
                    recipientId: e.target.value
                  })}
                  required
                  aria-required="true"
                  autoComplete="off"
                >
                  <option value="">Seleccionar destinatario...</option>
                  {isTeacher ? (
                    <>
                      <option value="2">Pablo Rosales (Padre/Madre)</option>
                      <option value="parent_3">Carmen Ruiz (Madre de Luis)</option>
                      <option value="parent_4">María García (Madre de Juan)</option>
                    </>
                  ) : (
                    <>
                      <option value="1">James Kennedy (Profesor)</option>
                      <option value="teacher_2">Prof. Ana Sánchez (Lengua)</option>
                      <option value="teacher_3">Prof. Luis Fernández (Ciencias)</option>
                    </>
                  )}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="subject-input">Asunto:</label>
                <input
                  id="subject-input"
                  type="text"
                  value={newConversationData.subject}
                  onChange={(e) => setNewConversationData({
                    ...newConversationData,
                    subject: e.target.value
                  })}
                  placeholder="Ej: Sobre la tarea de matemáticas"
                  required
                  aria-required="true"
                  autoComplete="off"
                />
              </div>

              <div className="form-group">
                <label htmlFor="event-select">Relacionado con evento (opcional):</label>
                <select
                  id="event-select"
                  value={newConversationData.eventId}
                  onChange={(e) => setNewConversationData({
                    ...newConversationData,
                    eventId: e.target.value
                  })}
                >
                  <option value="">Sin relacionar</option>
                  <option value="event_1">📝 Entrega trabajo matemáticas - 15 Ene</option>
                  <option value="event_2">📚 Examen de lengua - 20 Ene</option>
                  <option value="event_3">🎨 Excursión al museo - 25 Ene</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowNewConversation(false)} className="btn-cancel">
                  Cancelar
                </button>
                <button type="submit" className="btn-create">
                  Crear conversación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="messaging-layout">
        {/* Lista de conversaciones */}
        <div className={`conversations-list ${showMobileMessages ? 'mobile-hidden' : ''}`}>
          <div className="conversations-header">
            <h3>Conversaciones</h3>
            <span className="conversation-count" aria-label={`${conversations.length} conversaciones`}>
              {conversations.length}
            </span>
          </div>

          {conversations.length === 0 ? (
            <div className="empty-state" role="status">
              <p aria-hidden="true">📭</p>
              <p>No hay conversaciones</p>
              <p className="hint">
                {isTeacher 
                  ? 'Inicia una nueva conversación con un padre/madre'
                  : 'Inicia una nueva conversación con un profesor'}
              </p>
            </div>
          ) : (
            <div className="conversations-items" role="list" aria-label="Lista de conversaciones">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  role="listitem"
                  className={`conversation-item ${
                    selectedConversation?.id === conv.id ? 'active' : ''
                  } ${conv.unreadCount > 0 ? 'unread' : ''}`}
                  onClick={() => handleSelectConversation(conv.id)}
                  tabIndex={0}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handleSelectConversation(conv.id)
                    }
                  }}
                  aria-label={`Conversación con ${conv.participantName}: ${conv.subject}${conv.unreadCount > 0 ? `, ${conv.unreadCount} mensajes sin leer` : ''}`}
                >
                  <div className="conversation-avatar" aria-hidden="true">
                    {conv.participantRole === 'teacher' ? '👨‍🏫' : '👨‍👩‍👧'}
                  </div>
                  <div className="conversation-info">
                    <div className="conversation-header-row">
                      <h4>{conv.participantName}</h4>
                      <span className="conversation-time">
                        {formatTimeAgo(conv.lastMessageDate)}
                      </span>
                    </div>
                    <p className="conversation-subject">{conv.subject}</p>
                    {conv.eventTitle && (
                      <span className="conversation-event">
                        📅 {conv.eventTitle}
                      </span>
                    )}
                    <p className="conversation-preview">
                      {conv.lastMessage}
                    </p>
                  </div>
                  {conv.unreadCount > 0 && (
                    <div className="unread-badge" aria-label={`${conv.unreadCount} sin leer`}>
                      {conv.unreadCount}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Panel de mensajes */}
        <div className={`messages-panel ${showMobileMessages ? 'mobile-visible' : ''}`}>
          {selectedConversation ? (
            <>
              <div className="messages-header">
                <button 
                  className="btn-back-mobile"
                  onClick={() => setShowMobileMessages(false)}
                  aria-label="Volver a conversaciones"
                >
                  ← Volver
                </button>
                <div className="messages-header-info">
                  <div className="participant-avatar">
                    {selectedConversation.participantRole === 'teacher' ? '👨‍🏫' : '👨‍👩‍👧'}
                  </div>
                  <div>
                    <h3>{selectedConversation.participantName}</h3>
                    <p className="messages-subject">{selectedConversation.subject}</p>
                    {selectedConversation.eventTitle && (
                      <span className="messages-event">
                        📅 Relacionado: {selectedConversation.eventTitle}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="messages-content" role="log" aria-live="polite" aria-label="Mensajes de la conversación">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`message ${String(msg.senderId) === normalizedUserId ? 'sent' : 'received'}`}
                    role="article"
                    aria-label={`Mensaje de ${msg.senderName}`}
                  >
                    <div className="message-avatar" aria-hidden="true">
                      {msg.senderRole === 'teacher' ? '👨‍🏫' : '👨‍👩‍👧'}
                    </div>
                    <div className="message-bubble">
                      <div className="message-header">
                        <span className="message-sender">{msg.senderName}</span>
                        <span className="message-time">
                          {new Date(msg.timestamp).toLocaleString('es-ES', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <div className="message-content">
                        {msg.content}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <form className="message-input-form" onSubmit={handleSendMessage}>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Escribe un mensaje..."
                  className="message-input"
                  aria-label="Escribe tu mensaje"
                  disabled={sendingMessage}
                  autoComplete="off"
                />
                <Tooltip content="Enviar mensaje" position="left">
                  <button
                    type="submit"
                    className="btn-send"
                    disabled={!newMessage.trim() || sendingMessage}
                    aria-label="Enviar mensaje"
                  >
                    {sendingMessage ? '⌛' : '➤'}
                  </button>
                </Tooltip>
              </form>
            </>
          ) : (
            <div className="no-conversation-selected">
              <p>💬</p>
              <p>Selecciona una conversación para ver los mensajes</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

Messaging.propTypes = {
  userRole: PropTypes.oneOf([USER_ROLES.TEACHER, USER_ROLES.PARENT]).isRequired,
  userId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  selectedEventId: PropTypes.string,
}

export default Messaging
