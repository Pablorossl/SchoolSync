// Servicio para manejar eventos del calendario
// TODO: BACKEND - Reemplazar con llamadas HTTP reales

import { STORAGE_KEYS, type EventType } from '@constants/ui'

/**
 * Tipo de evento del calendario
 */
export interface CalendarEvent {
  id: string
  title: string
  description?: string
  start: string
  end: string
  type: EventType
  createdAt?: string
  [key: string]: any
}

/**
 * Obtener todos los eventos del calendario
 */
export const getEvents = async (): Promise<CalendarEvent[]> => {
  await new Promise(resolve => setTimeout(resolve, 300))
  
  const eventsStr = localStorage.getItem(STORAGE_KEYS.EVENTS)
  if (!eventsStr) return []
  
  try {
    return JSON.parse(eventsStr)
  } catch {
    return []
  }
}

/**
 * Crear nuevo evento
 */
export const createEvent = async (eventData: Partial<CalendarEvent>): Promise<CalendarEvent> => {
  await new Promise(resolve => setTimeout(resolve, 300))
  
  const events = await getEvents()
  const newEvent: CalendarEvent = {
    id: Date.now().toString(),
    title: eventData.title || '',
    start: eventData.start || '',
    end: eventData.end || '',
    type: eventData.type || 'event',
    ...eventData,
    createdAt: new Date().toISOString(),
  }
  
  const updatedEvents = [...events, newEvent]
  localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(updatedEvents))
  
  return newEvent
}

/**
 * Actualizar evento existente
 */
export const updateEvent = async (
  eventId: string,
  eventData: Partial<CalendarEvent>
): Promise<CalendarEvent | undefined> => {
  await new Promise(resolve => setTimeout(resolve, 300))
  
  const events = await getEvents()
  const updatedEvents = events.map(event =>
    event.id === eventId ? { ...event, ...eventData } : event
  )
  
  localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(updatedEvents))
  
  return updatedEvents.find(e => e.id === eventId)
}

/**
 * Eliminar evento
 */
export const deleteEvent = async (eventId: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 300))
  
  const events = await getEvents()
  const updatedEvents = events.filter(event => event.id !== eventId)
  
  localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(updatedEvents))
  
  return true
}

export default {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
}
