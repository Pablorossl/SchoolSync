import { useState, useEffect } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import esLocale from '@fullcalendar/core/locales/es'
import type { DateClickArg } from '@fullcalendar/interaction'
import type { EventClickArg } from '@fullcalendar/core'
import * as calendarService from '../../services/calendarService'
import type { CalendarEvent } from '../../services/calendarService'
import EventModal, { type EventData } from '../EventModal/EventModal'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'
import { useToast } from '../../context/ToastContext'
import { EVENT_COLORS, USER_ROLES } from '../../constants/ui'
import { useAsyncOperation } from '../../utils/helpers'
import './Calendar.css'

/**
 * Props del componente Calendar
 */
interface CalendarProps {
  userRole: string
}

/**
 * Componente de calendario interactivo
 */
const Calendar = ({ userRole }: CalendarProps) => {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [showModal, setShowModal] = useState<boolean>(false)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

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
  const handleDateClick = (info: DateClickArg) => {
    if (!isTeacher) return

    setSelectedDate(info.dateStr)
    setSelectedEvent(null)
    setShowModal(true)
  }

  // Manejar clic en un evento
  const handleEventClick = (info: EventClickArg) => {
    const event = events.find(e => e.id === info.event.id)
    setSelectedEvent(event || null)
    setShowModal(true)
  }

  // Crear nuevo evento
  const handleCreateEvent = async (eventData: EventData) => {
    const newEvent = await asyncOp(
      () => calendarService.createEvent({ ...eventData, start: selectedDate || eventData.start }),
      'No se pudo crear el evento'
    )
    if (newEvent) {
      setEvents([...events, newEvent])
      setShowModal(false)
      toast.success('Evento creado correctamente')
    }
  }

  // Actualizar evento
  const handleUpdateEvent = async (eventData: EventData) => {
    if (!selectedEvent?.id) return
    
    const success = await asyncOp(
      () => calendarService.updateEvent(selectedEvent.id!, eventData),
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
    if (!selectedEvent?.id) return
    
    const success = await asyncOp(
      () => calendarService.deleteEvent(selectedEvent.id!),
      'No se pudo eliminar el evento'
    )
    if (success) {
      setEvents(events.filter(e => e.id !== selectedEvent.id))
      setShowModal(false)
      toast.success('Evento eliminado correctamente')
    }
  }

  // Colores según tipo de evento
  const getEventColor = (eventType: string): string => {
    return EVENT_COLORS[eventType as keyof typeof EVENT_COLORS] || '#6b7280'
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

export default Calendar
