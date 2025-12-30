// Servicio para manejar eventos del calendario
// TODO: BACKEND - Reemplazar con llamadas HTTP reales

import { STORAGE_KEYS } from '../constants/ui'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

/**
 * Obtener todos los eventos del calendario
 * TODO: BACKEND - Implementar:
 * 
 * const token = localStorage.getItem('token')
 * const response = await fetch(`${API_URL}/events`, {
 *   headers: { 'Authorization': `Bearer ${token}` }
 * })
 * return await response.json()
 */
export const getEvents = async () => {
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
 * TODO: BACKEND - Implementar:
 * 
 * const token = localStorage.getItem('token')
 * const response = await fetch(`${API_URL}/events`, {
 *   method: 'POST',
 *   headers: {
 *     'Content-Type': 'application/json',
 *     'Authorization': `Bearer ${token}`
 *   },
 *   body: JSON.stringify(eventData)
 * })
 */
export const createEvent = async (eventData) => {
  await new Promise(resolve => setTimeout(resolve, 300))
  
  const events = await getEvents()
  const newEvent = {
    id: Date.now().toString(),
    ...eventData,
    createdAt: new Date().toISOString(),
  }
  
  const updatedEvents = [...events, newEvent]
  localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(updatedEvents))
  
  return newEvent
}

/**
 * Actualizar evento existente
 * TODO: BACKEND - Implementar:
 * 
 * const token = localStorage.getItem('token')
 * const response = await fetch(`${API_URL}/events/${eventId}`, {
 *   method: 'PUT',
 *   headers: {
 *     'Content-Type': 'application/json',
 *     'Authorization': `Bearer ${token}`
 *   },
 *   body: JSON.stringify(eventData)
 * })
 */
export const updateEvent = async (eventId, eventData) => {
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
 * TODO: BACKEND - Implementar:
 * 
 * const token = localStorage.getItem('token')
 * await fetch(`${API_URL}/events/${eventId}`, {
 *   method: 'DELETE',
 *   headers: { 'Authorization': `Bearer ${token}` }
 * })
 */
export const deleteEvent = async (eventId) => {
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
