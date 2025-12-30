import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import esLocale from '@fullcalendar/core/locales/es'
import * as calendarService from '../../services/calendarService'
import EventModal from '../EventModal/EventModal'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'
import { useToast } from '../../context/ToastContext'
import logger from '../../utils/logger'
import { EVENT_COLORS, USER_ROLES } from '../../constants/ui'
import { useAsyncOperation } from '../../utils/helpers'
import './Calendar.css'

const Calendar = ({ userRole }) => {
  const [events, setEvents] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [loading, setLoading] = useState(true)

  const toast = useToast()
  const isTeacher = userRole === USER_ROLES.TEACHER
  const asyncOp = useAsyncOperation()

  // Cargar eventos al montar el componente
  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    const result = await asyncOp(
      () => calendarService.getEvents(),
      'No se pudieron cargar los eventos'
    )
    if (result) {
      setEvents(result)
    }
    setLoading(false)
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
    const newEvent = await asyncOp(
      () => calendarService.createEvent({ ...eventData, start: selectedDate }),
      'No se pudo crear el evento'
    )
    if (newEvent) {
      setEvents([...events, newEvent])
      setShowModal(false)
      toast.success('Evento creado correctamente')
    }
  }

  // Actualizar evento
  const handleUpdateEvent = async (eventData) => {
    const success = await asyncOp(
      () => calendarService.updateEvent(selectedEvent.id, eventData),
      'No se pudo actualizar el evento'
    )
    if (success) {
      setEvents(events.map(e => 
        e.id === selectedEvent.id ? { ...e, ...eventData } : e
      ))
      setShowModal(false)
      toast.success('Evento actualizado correctamente')
    }
  }

  // Eliminar evento
  const handleDeleteEvent = async () => {
    const success = await asyncOp(
      () => calendarService.deleteEvent(selectedEvent.id),
      'No se pudo eliminar el evento'
    )
    if (success) {
      setEvents(events.filter(e => e.id !== selectedEvent.id))
      setShowModal(false)
      toast.success('Evento eliminado correctamente')
    }
  }

  // Colores según tipo de evento
  const getEventColor = (eventType) => {
    return EVENT_COLORS[eventType] || EVENT_COLORS.default
  }

  if (loading) {
    return (
      <div className="calendar-loading">
        <LoadingSpinner size="medium" message="Cargando calendario..." />
      </div>
    )
  }

  return (
    <div className="calendar-container" role="region" aria-label="Calendario escolar">
      <div className="calendar-header">
        <h2>Calendario Escolar</h2>
        {!isTeacher && (
          <p className="calendar-notice" role="status">
            👀 Vista de solo lectura - Solo los profesores pueden editar
          </p>
        )}
      </div>

      <div className="calendar-legend" role="list" aria-label="Leyenda de tipos de eventos">
        <span className="legend-item" role="listitem">
          <span className="legend-dot" style={{ background: EVENT_COLORS.task }} aria-hidden="true"></span>
          Tareas
        </span>
        <span className="legend-item" role="listitem">
          <span className="legend-dot" style={{ background: EVENT_COLORS.exam }} aria-hidden="true"></span>
          Exámenes
        </span>
        <span className="legend-item" role="listitem">
          <span className="legend-dot" style={{ background: EVENT_COLORS.note }} aria-hidden="true"></span>
          Notas
        </span>
        <span className="legend-item" role="listitem">
          <span className="legend-dot" style={{ background: EVENT_COLORS.event }} aria-hidden="true"></span>
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

Calendar.propTypes = {
  userRole: PropTypes.oneOf([USER_ROLES.TEACHER, USER_ROLES.PARENT]).isRequired,
}

export default Calendar
