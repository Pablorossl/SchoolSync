import { describe, it, expect, beforeEach } from 'vitest'
import * as messagingService from '../services/messagingService'

describe('messagingService', () => {
  beforeEach(() => {
    // Limpiar datos antes de cada test
    localStorage.clear()
    messagingService.clearAllMessagingData()
  })

  describe('sendMessage', () => {
    it('debería crear un nuevo mensaje y agregarlo a localStorage', async () => {
      // Arrange: configurar usuario autenticado
      const mockUser = {
        id: '1',
        name: 'James Kennedy',
        role: 'teacher',
        email: 'profesor@schoolsync.com'
      }
      localStorage.setItem('schoolsync_user', JSON.stringify(mockUser))

      // Crear una conversación de prueba
      const conversation = await messagingService.createConversation({
        recipientId: '2',
        subject: 'Test Conversation',
        eventId: null
      })

      const messageContent = 'Hola, este es un mensaje de prueba'

      // Act: enviar mensaje
      const result = await messagingService.sendMessage({
        conversationId: conversation.id,
        content: messageContent
      })

      // Assert: verificar que el mensaje se creó correctamente
      expect(result).toBeDefined()
      expect(result.id).toBeDefined()
      expect(result.conversationId).toBe(conversation.id)
      expect(result.senderId).toBe('1')
      expect(result.senderName).toBe('James Kennedy')
      expect(result.senderRole).toBe('teacher')
      expect(result.content).toBe(messageContent)
      expect(result.timestamp).toBeTruthy()
      expect(typeof result.timestamp).toBe('string')

      // Verificar que el mensaje está en localStorage
      const storedMessages = JSON.parse(localStorage.getItem('schoolsync_messages'))
      expect(storedMessages[conversation.id]).toBeDefined()
      expect(storedMessages[conversation.id].length).toBe(1)
      expect(storedMessages[conversation.id][0].content).toBe(messageContent)
    })

    it('debería actualizar lastMessage y lastMessageDate de la conversación', async () => {
      // Arrange
      const mockUser = {
        id: '2',
        name: 'Pablo Rosales',
        role: 'parent'
      }
      localStorage.setItem('schoolsync_user', JSON.stringify(mockUser))

      const conversation = await messagingService.createConversation({
        recipientId: '1',
        subject: 'Test Update',
        eventId: null
      })

      const messageContent = 'Mensaje de prueba'

      // Act
      await messagingService.sendMessage({
        conversationId: conversation.id,
        content: messageContent
      })

      // Assert: verificar que la conversación se actualizó
      const storedConversations = JSON.parse(localStorage.getItem('schoolsync_conversations'))
      const updatedConv = storedConversations.find(c => c.id === conversation.id)
      
      expect(updatedConv).toBeDefined()
      expect(updatedConv.lastMessage).toBe(messageContent)
      expect(updatedConv.lastMessageDate).toBeDefined()
    })

    it('debería incrementar unreadBy para el otro participante', async () => {
      // Arrange: usuario '1' envía mensaje
      const mockUser = {
        id: '1',
        name: 'James Kennedy',
        role: 'teacher'
      }
      localStorage.setItem('schoolsync_user', JSON.stringify(mockUser))

      const conversation = await messagingService.createConversation({
        recipientId: '2',
        subject: 'Test Unread',
        eventId: null
      })

      // Act: enviar 2 mensajes
      await messagingService.sendMessage({
        conversationId: conversation.id,
        content: 'Primer mensaje'
      })
      
      await messagingService.sendMessage({
        conversationId: conversation.id,
        content: 'Segundo mensaje'
      })

      // Assert: verificar que el contador de no leídos para usuario '2' es 2
      const storedConversations = JSON.parse(localStorage.getItem('schoolsync_conversations'))
      const updatedConv = storedConversations.find(c => c.id === conversation.id)
      
      expect(updatedConv.unreadBy).toBeDefined()
      expect(updatedConv.unreadBy['2']).toBe(2)
    })

    it('debería fallar si no hay usuario autenticado', async () => {
      // Arrange: sin usuario en localStorage
      localStorage.removeItem('schoolsync_user')

      // Act & Assert
      await expect(
        messagingService.sendMessage({
          conversationId: 'conv_test',
          content: 'Test'
        })
      ).rejects.toThrow('Usuario no autenticado')
    })
  })

  describe('markAsRead', () => {
    it('debería resetear el contador unreadBy para el usuario actual', async () => {
      // Arrange: crear conversación y mensajes como usuario '1'
      const user1 = {
        id: '1',
        name: 'James Kennedy',
        role: 'teacher'
      }
      localStorage.setItem('schoolsync_user', JSON.stringify(user1))

      const conversation = await messagingService.createConversation({
        recipientId: '2',
        subject: 'Test MarkAsRead',
        eventId: null
      })

      await messagingService.sendMessage({
        conversationId: conversation.id,
        content: 'Mensaje 1'
      })

      // Cambiar a usuario '2' (receptor)
      const user2 = {
        id: '2',
        name: 'Pablo Rosales',
        role: 'parent'
      }
      localStorage.setItem('schoolsync_user', JSON.stringify(user2))

      // Verificar que hay mensajes sin leer
      const convsBefore = JSON.parse(localStorage.getItem('schoolsync_conversations'))
      const convBefore = convsBefore.find(c => c.id === conversation.id)
      expect(convBefore.unreadBy['2']).toBe(1)

      // Act: marcar como leído
      await messagingService.markAsRead(conversation.id)

      // Assert: verificar que el contador se reseteó
      const convsAfter = JSON.parse(localStorage.getItem('schoolsync_conversations'))
      const convAfter = convsAfter.find(c => c.id === conversation.id)
      expect(convAfter.unreadBy['2']).toBe(0)
    })

    it('debería manejar conversación sin unreadBy previo', async () => {
      // Arrange
      const mockUser = {
        id: '1',
        name: 'Test User',
        role: 'teacher'
      }
      localStorage.setItem('schoolsync_user', JSON.stringify(mockUser))

      // Crear conversación manualmente sin unreadBy
      const testConv = {
        id: 'test_conv',
        participants: ['1', '2'],
        subject: 'Test',
        lastMessage: '',
        lastMessageDate: new Date().toISOString(),
        createdAt: new Date().toISOString()
      }
      localStorage.setItem('schoolsync_conversations', JSON.stringify([testConv]))

      // Act
      await messagingService.markAsRead('test_conv')

      // Assert: debería crear unreadBy si no existía
      const convs = JSON.parse(localStorage.getItem('schoolsync_conversations'))
      expect(convs[0].unreadBy).toBeDefined()
      expect(convs[0].unreadBy['1']).toBe(0)
    })
  })

  describe('createConversation', () => {
    it('debería normalizar IDs a strings', async () => {
      // Arrange
      const mockUser = {
        id: 1, // Enviamos como number
        name: 'Test User',
        role: 'teacher'
      }
      localStorage.setItem('schoolsync_user', JSON.stringify(mockUser))

      // Act: pasar recipientId como number
      const conversation = await messagingService.createConversation({
        recipientId: 2, // number
        subject: 'Test Normalization',
        eventId: null
      })

      // Assert: verificar que participants contiene strings
      expect(conversation.participants).toEqual(['1', '2'])
      expect(conversation.participantId).toBe('2')
      
      const stored = JSON.parse(localStorage.getItem('schoolsync_conversations'))
      expect(stored[0].participants).toEqual(['1', '2'])
    })
  })

  describe('getConversations', () => {
    it('debería filtrar conversaciones por usuario actual con IDs normalizados', async () => {
      // Arrange: limpiar y crear datos para múltiples usuarios
      messagingService.clearAllMessagingData()
      
      const user1 = { id: '1', name: 'User 1', role: 'teacher' }
      const user2 = { id: '2', name: 'User 2', role: 'parent' }
      
      // Crear conversaciones como user1
      localStorage.setItem('schoolsync_user', JSON.stringify(user1))
      await messagingService.createConversation({
        recipientId: '2',
        subject: 'Conv 1-2',
        eventId: null
      })

      // Cambiar a user2 y crear otra
      localStorage.setItem('schoolsync_user', JSON.stringify(user2))
      await messagingService.createConversation({
        recipientId: 'teacher_2',
        subject: 'Conv 2-teacher2',
        eventId: null
      })

      // Act: obtener conversaciones como user1
      localStorage.setItem('schoolsync_user', JSON.stringify(user1))
      const conversationsUser1 = await messagingService.getConversations()

      // Assert: user1 debe ver solo conversaciones donde participa (incluye la de ejemplo inicial)
      expect(conversationsUser1.length).toBeGreaterThanOrEqual(1)
      const conv1_2 = conversationsUser1.find(c => c.subject === 'Conv 1-2')
      expect(conv1_2).toBeDefined()
      expect(conv1_2.participantId).toBe('2')

      // Act: obtener como user2
      localStorage.setItem('schoolsync_user', JSON.stringify(user2))
      const conversationsUser2 = await messagingService.getConversations()

      // Assert: user2 debe ver las conversaciones donde participa (1-2 y 2-teacher2, más la de ejemplo)
      expect(conversationsUser2.length).toBeGreaterThanOrEqual(2)
      const convUserTeacher = conversationsUser2.find(c => c.subject === 'Conv 2-teacher2')
      expect(convUserTeacher).toBeDefined()
    })
  })
})
