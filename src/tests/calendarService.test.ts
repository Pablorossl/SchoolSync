import { describe, it, expect, beforeEach } from 'vitest'
import * as calendarService from '../services/calendarService'

describe('calendarService', () => {
  beforeEach(() => {
    // Limpiar localStorage antes de cada test
    localStorage.clear()
  })

  describe('getEvents', () => {
    it('debería retornar array vacío si no hay eventos', async () => {
      // Act
      const events = await calendarService.getEvents()

      // Assert
      expect(events).toEqual([])
      expect(Array.isArray(events)).toBe(true)
    })

    it('debería retornar eventos guardados en localStorage', async () => {
      // Arrange: guardar eventos manualmente
      const mockEvents = [
        {
          id: '1',
          title: 'Examen de matemáticas',
          type: 'exam',
          start: '2025-01-15',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Entrega de proyecto',
          type: 'task',
          start: '2025-01-20',
          createdAt: new Date().toISOString()
        }
      ]
      localStorage.setItem('schoolsync_events', JSON.stringify(mockEvents))

      // Act
      const events = await calendarService.getEvents()

      // Assert
      expect(events.length).toBe(2)
      expect(events[0].title).toBe('Examen de matemáticas')
      expect(events[1].title).toBe('Entrega de proyecto')
    })

    it('debería manejar datos corruptos en localStorage', async () => {
      // Arrange: guardar JSON inválido
      localStorage.setItem('schoolsync_events', 'invalid json{')

      // Act
      const events = await calendarService.getEvents()

      // Assert: debería retornar array vacío sin crashear
      expect(events).toEqual([])
    })
  })

  describe('createEvent', () => {
    it('debería crear un nuevo evento y guardarlo en localStorage', async () => {
      // Arrange
      const eventData = {
        title: 'Nueva tarea',
        description: 'Hacer los ejercicios del capítulo 5',
        type: 'task',
        start: '2025-01-25',
        end: '2025-01-25'
      }

      // Act
      const newEvent = await calendarService.createEvent(eventData)

      // Assert: verificar evento creado
      expect(newEvent).toBeDefined()
      expect(newEvent.id).toBeDefined()
      expect(newEvent.title).toBe('Nueva tarea')
      expect(newEvent.description).toBe('Hacer los ejercicios del capítulo 5')
      expect(newEvent.type).toBe('task')
      expect(newEvent.createdAt).toBeDefined()

      // Verificar que está en localStorage
      const storedEvents = JSON.parse(localStorage.getItem('schoolsync_events'))
      expect(storedEvents.length).toBe(1)
      expect(storedEvents[0].id).toBe(newEvent.id)
    })

    it('debería agregar evento a la lista existente', async () => {
      // Arrange: crear primer evento
      const event1 = await calendarService.createEvent({
        title: 'Evento 1',
        type: 'event',
        start: '2025-01-10'
      })

      // Act: crear segundo evento
      const event2 = await calendarService.createEvent({
        title: 'Evento 2',
        type: 'note',
        start: '2025-01-11'
      })

      // Assert: ambos eventos deben existir
      const events = await calendarService.getEvents()
      expect(events.length).toBe(2)
      expect(events.find(e => e.id === event1.id)).toBeDefined()
      expect(events.find(e => e.id === event2.id)).toBeDefined()
    })

    it('debería generar ID único para cada evento', async () => {
      // Act: crear múltiples eventos
      const event1 = await calendarService.createEvent({ title: 'A', type: 'task', start: '2025-01-01' })
      const event2 = await calendarService.createEvent({ title: 'B', type: 'task', start: '2025-01-02' })
      const event3 = await calendarService.createEvent({ title: 'C', type: 'task', start: '2025-01-03' })

      // Assert: IDs deben ser diferentes
      expect(event1.id).not.toBe(event2.id)
      expect(event2.id).not.toBe(event3.id)
      expect(event1.id).not.toBe(event3.id)
    })
  })

  describe('updateEvent', () => {
    it('debería actualizar un evento existente', async () => {
      // Arrange: crear evento
      const originalEvent = await calendarService.createEvent({
        title: 'Evento Original',
        description: 'Descripción original',
        type: 'task',
        start: '2025-01-15'
      })

      // Act: actualizar evento
      const updatedData = {
        title: 'Evento Actualizado',
        description: 'Descripción actualizada',
        type: 'exam'
      }
      const updatedEvent = await calendarService.updateEvent(originalEvent.id, updatedData)

      // Assert: verificar actualización
      expect(updatedEvent.id).toBe(originalEvent.id)
      expect(updatedEvent.title).toBe('Evento Actualizado')
      expect(updatedEvent.description).toBe('Descripción actualizada')
      expect(updatedEvent.type).toBe('exam')
      expect(updatedEvent.start).toBe('2025-01-15') // No cambió
      expect(updatedEvent.createdAt).toBe(originalEvent.createdAt) // Mantiene fecha creación

      // Verificar en localStorage
      const events = await calendarService.getEvents()
      const storedEvent = events.find(e => e.id === originalEvent.id)
      expect(storedEvent.title).toBe('Evento Actualizado')
    })

    it('debería actualizar solo el evento especificado', async () => {
      // Arrange: crear dos eventos
      const event1 = await calendarService.createEvent({
        title: 'Evento 1',
        type: 'task',
        start: '2025-01-10'
      })
      const event2 = await calendarService.createEvent({
        title: 'Evento 2',
        type: 'exam',
        start: '2025-01-20'
      })

      // Act: actualizar solo event1
      await calendarService.updateEvent(event1.id, {
        title: 'Evento 1 Modificado'
      })

      // Assert: event2 no debe cambiar
      const events = await calendarService.getEvents()
      const updatedEvent1 = events.find(e => e.id === event1.id)
      const unchangedEvent2 = events.find(e => e.id === event2.id)

      expect(updatedEvent1.title).toBe('Evento 1 Modificado')
      expect(unchangedEvent2.title).toBe('Evento 2')
    })

    it('debería retornar el evento actualizado', async () => {
      // Arrange
      const event = await calendarService.createEvent({
        title: 'Test',
        type: 'note',
        start: '2025-01-05'
      })

      // Act
      const result = await calendarService.updateEvent(event.id, {
        description: 'Nueva descripción'
      })

      // Assert
      expect(result).toBeDefined()
      expect(result.id).toBe(event.id)
      expect(result.description).toBe('Nueva descripción')
    })
  })

  describe('deleteEvent', () => {
    it('debería eliminar un evento de localStorage', async () => {
      // Arrange: crear evento
      const event = await calendarService.createEvent({
        title: 'Evento a eliminar',
        type: 'task',
        start: '2025-01-30'
      })

      // Verificar que existe
      let events = await calendarService.getEvents()
      expect(events.length).toBe(1)

      // Act: eliminar
      const result = await calendarService.deleteEvent(event.id)

      // Assert: verificar eliminación
      expect(result).toBe(true)
      events = await calendarService.getEvents()
      expect(events.length).toBe(0)
      expect(events.find(e => e.id === event.id)).toBeUndefined()
    })

    it('debería eliminar solo el evento especificado', async () => {
      // Arrange: crear tres eventos
      const event1 = await calendarService.createEvent({ title: 'A', type: 'task', start: '2025-01-01' })
      const event2 = await calendarService.createEvent({ title: 'B', type: 'task', start: '2025-01-02' })
      const event3 = await calendarService.createEvent({ title: 'C', type: 'task', start: '2025-01-03' })

      // Act: eliminar event2
      await calendarService.deleteEvent(event2.id)

      // Assert: event1 y event3 deben seguir existiendo
      const events = await calendarService.getEvents()
      expect(events.length).toBe(2)
      expect(events.find(e => e.id === event1.id)).toBeDefined()
      expect(events.find(e => e.id === event2.id)).toBeUndefined()
      expect(events.find(e => e.id === event3.id)).toBeDefined()
    })

    it('debería manejar eliminación de evento inexistente', async () => {
      // Arrange: crear un evento
      await calendarService.createEvent({
        title: 'Evento único',
        type: 'task',
        start: '2025-01-15'
      })

      // Act: intentar eliminar ID que no existe
      const result = await calendarService.deleteEvent('id_inexistente')

      // Assert: no debería crashear
      expect(result).toBe(true)
      const events = await calendarService.getEvents()
      expect(events.length).toBe(1) // El evento real sigue ahí
    })
  })

  describe('Integración CRUD completa', () => {
    it('debería permitir crear, leer, actualizar y eliminar eventos', async () => {
      // Create
      const event = await calendarService.createEvent({
        title: 'Proyecto final',
        description: 'Presentación del proyecto',
        type: 'event',
        start: '2025-02-01',
        end: '2025-02-01'
      })
      expect(event.id).toBeDefined()

      // Read
      let events = await calendarService.getEvents()
      expect(events.length).toBe(1)
      expect(events[0].title).toBe('Proyecto final')

      // Update
      await calendarService.updateEvent(event.id, {
        title: 'Proyecto Final - Actualizado',
        description: 'Presentación actualizada'
      })
      events = await calendarService.getEvents()
      expect(events[0].title).toBe('Proyecto Final - Actualizado')

      // Delete
      await calendarService.deleteEvent(event.id)
      events = await calendarService.getEvents()
      expect(events.length).toBe(0)
    })
  })
})
