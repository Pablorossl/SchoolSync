import { useState, useEffect } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import esLocale from '@fullcalendar/core/locales/es'
import * as calendarService from '../../services/calendarService'
import EventModal from '../EventModal/EventModal'
import './Calendar.css'

const Calendar = ({ userRole }) => {
  const [events, setEvents] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [loading, setLoading] = useState(true)

  const isTeacher = userRole === 'teacher'

  // Cargar eventos al montar el componente
  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    try {
      const fetchedEvents = await calendarService.getEvents()
      setEvents(fetchedEvents)
    } catch (error) {
      console.error('Error cargando eventos:', error)
    } finally {
      setLoading(false)
    }
  }

  // Manejar clic en una fecha (solo profesores)
  const handleDateClick = (info) => {
    if (!isTeacher) return

    setSelectedDate(info.dateStr)
    setSelectedEvent(null)
    setShowModal(true)
  }

  // Manejar clic en un evento
  const handleEventClick = (info) => {
    const event = events.find(e => e.id === info.event.id)
    setSelectedEvent(event)
    setShowModal(true)
  }

  // Crear nuevo evento
  const handleCreateEvent = async (eventData) => {
    try {
      const newEvent = await calendarService.createEvent({
        ...eventData,
        start: selectedDate,
      })
      setEvents([...events, newEvent])
      setShowModal(false)
    } catch (error) {
      console.error('Error creando evento:', error)
      alert('Error al crear el evento')
    }
  }

  // Actualizar evento
  const handleUpdateEvent = async (eventData) => {
    try {
      await calendarService.updateEvent(selectedEvent.id, eventData)
      setEvents(events.map(e => 
        e.id === selectedEvent.id ? { ...e, ...eventData } : e
      ))
      setShowModal(false)
    } catch (error) {
      console.error('Error actualizando evento:', error)
      alert('Error al actualizar el evento')
    }
  }

  // Eliminar evento
  const handleDeleteEvent = async () => {
    if (!window.confirm('¿Estás seguro de eliminar este evento?')) return

    try {
      await calendarService.deleteEvent(selectedEvent.id)
      setEvents(events.filter(e => e.id !== selectedEvent.id))
      setShowModal(false)
    } catch (error) {
      console.error('Error eliminando evento:', error)
      alert('Error al eliminar el evento')
    }
  }

  // Colores según tipo de evento
  const getEventColor = (eventType) => {
    const colors = {
      task: '#ef4444',      // Rojo para tareas
      exam: '#f59e0b',      // Naranja para exámenes
      note: '#3b82f6',      // Azul para notas
      event: '#10b981',     // Verde para eventos
    }
    return colors[eventType] || '#6b7280'
  }

  if (loading) {
    return (
      <div className="calendar-loading">
        <div className="spinner"></div>
        <p>Cargando calendario...</p>
      </div>
    )
  }

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <h2>Calendario Escolar</h2>
        {!isTeacher && (
          <p className="calendar-notice">
            👀 Vista de solo lectura - Solo los profesores pueden editar
          </p>
        )}
      </div>

      <div className="calendar-legend">
        <span className="legend-item">
          <span className="legend-dot" style={{ background: '#ef4444' }}></span>
          Tareas
        </span>
        <span className="legend-item">
          <span className="legend-dot" style={{ background: '#f59e0b' }}></span>
          Exámenes
        </span>
        <span className="legend-item">
          <span className="legend-dot" style={{ background: '#3b82f6' }}></span>
          Notas
        </span>
        <span className="legend-item">
          <span className="legend-dot" style={{ background: '#10b981' }}></span>
          Eventos
        </span>
      </div>

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale={esLocale}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek'
        }}
        events={events.map(event => ({
          id: event.id,
          title: event.title,
          start: event.start,
          end: event.end,
          backgroundColor: getEventColor(event.type),
          borderColor: getEventColor(event.type),
        }))}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        editable={false}
        selectable={isTeacher}
        height="auto"
      />

      {showModal && (
        <EventModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSave={selectedEvent ? handleUpdateEvent : handleCreateEvent}
          onDelete={selectedEvent ? handleDeleteEvent : null}
          event={selectedEvent}
          isTeacher={isTeacher}
        />
      )}
    </div>
  )
}

export default Calendar
