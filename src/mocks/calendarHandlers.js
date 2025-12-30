import { http, HttpResponse, delay } from 'msw'
import { mockDb } from './authHandlers'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Handler: Get Events
const getEventsHandler = http.get(`${API_URL}/events`, async () => {
  await delay(200)
  return HttpResponse.json(mockDb.events)
})

// Handler: Create Event
const createEventHandler = http.post(`${API_URL}/events`, async ({ request }) => {
  await delay(300)
  
  const eventData = await request.json()
  
  const newEvent = {
    id: `event_${Date.now()}`,
    ...eventData,
    createdAt: new Date().toISOString()
  }
  
  mockDb.events.push(newEvent)
  
  return HttpResponse.json(newEvent, { status: 201 })
})

// Handler: Update Event
const updateEventHandler = http.put(`${API_URL}/events/:id`, async ({ request, params }) => {
  await delay(300)
  
  const { id } = params
  const updates = await request.json()
  
  const index = mockDb.events.findIndex(e => e.id === id)
  
  if (index === -1) {
    return HttpResponse.json(
      { message: 'Evento no encontrado' },
      { status: 404 }
    )
  }
  
  mockDb.events[index] = {
    ...mockDb.events[index],
    ...updates,
    id // Mantener el ID original
  }
  
  return HttpResponse.json(mockDb.events[index])
})

// Handler: Delete Event
const deleteEventHandler = http.delete(`${API_URL}/events/:id`, async ({ params }) => {
  await delay(200)
  
  const { id } = params
  const index = mockDb.events.findIndex(e => e.id === id)
  
  if (index === -1) {
    return HttpResponse.json(
      { message: 'Evento no encontrado' },
      { status: 404 }
    )
  }
  
  mockDb.events.splice(index, 1)
  
  return HttpResponse.json({ message: 'Evento eliminado correctamente' })
})

export const calendarHandlers = [
  getEventsHandler,
  createEventHandler,
  updateEventHandler,
  deleteEventHandler
]
