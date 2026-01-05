import { useState, useEffect, type FormEvent, type ChangeEvent, type MouseEvent } from 'react'
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog'
import { EVENT_TYPES } from '../../constants/ui'
import './EventModal.css'

/**
 * Tipo de evento del calendario
 */
export type EventType = typeof EVENT_TYPES[keyof typeof EVENT_TYPES]

/**
 * Estructura de datos de un evento
 */
export interface EventData {
  id?: string
  title: string
  description?: string
  type: EventType
  start: string
  end: string
}

/**
 * Props del componente EventModal
 */
interface EventModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: EventData) => void
  onDelete?: (() => void) | null
  event?: EventData | null
  isTeacher: boolean
}

/**
 * Componente modal para crear/editar/ver eventos del calendario
 */
const EventModal = ({ isOpen, onClose, onSave, onDelete, event, isTeacher }: EventModalProps) => {
  const [formData, setFormData] = useState<EventData>({
    title: '',
    description: '',
    type: EVENT_TYPES.TASK,
    start: '',
    end: '',
  })
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false)

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || '',
        description: event.description || '',
        type: event.type || 'task',
        start: event.start || '',
        end: event.end || '',
      })
    }
  }, [event])

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (!isOpen) return null

  // Vista de solo lectura para padres
  if (!isTeacher && event) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e: MouseEvent) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Detalles del Evento</h2>
            <button onClick={onClose} className="btn-close">&times;</button>
          </div>

          <div className="event-details">
            <div className="detail-group">
              <label>Título:</label>
              <p>{event.title}</p>
            </div>

            <div className="detail-group">
              <label>Tipo:</label>
              <p className={`type-badge type-${event.type}`}>
                {event.type === EVENT_TYPES.TASK && '📝 Tarea'}
                {event.type === EVENT_TYPES.EXAM && '📚 Examen'}
                {event.type === EVENT_TYPES.NOTE && '📌 Nota'}
                {event.type === EVENT_TYPES.EVENT && '🎉 Evento'}
              </p>
            </div>

            {event.description && (
              <div className="detail-group">
                <label>Descripción:</label>
                <p>{event.description}</p>
              </div>
            )}

            <div className="detail-group">
              <label>Fecha:</label>
              <p>{new Date(event.start).toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</p>
            </div>
          </div>

          <div className="modal-footer">
            <button onClick={onClose} className="btn-secondary">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Formulario de edición para profesores
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{event ? 'Editar Evento' : 'Nuevo Evento'}</h2>
          <button onClick={onClose} className="btn-close">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Título *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ej: Entrega de proyecto"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="type">Tipo de Evento *</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value={EVENT_TYPES.TASK}>📝 Tarea</option>
              <option value={EVENT_TYPES.EXAM}>📚 Examen</option>
              <option value={EVENT_TYPES.NOTE}>📌 Nota Importante</option>
              <option value={EVENT_TYPES.EVENT}>🎉 Evento</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Descripción</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Detalles adicionales..."
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="start">Fecha de Inicio *</label>
              <input
                type="date"
                id="start"
                name="start"
                value={formData.start}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="end">Fecha de Fin</label>
              <input
                type="date"
                id="end"
                name="end"
                value={formData.end}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="modal-footer">
            {event && onDelete && (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="btn-danger"
                aria-label="Eliminar evento"
              >
                Eliminar
              </button>
            )}
            <div className="modal-actions">
              <button type="button" onClick={onClose} className="btn-secondary">
                Cancelar
              </button>
              <button type="submit" className="btn-primary">
                {event ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </div>
        </form>

        <ConfirmDialog
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={onDelete || (() => {})}
          title="¿Eliminar evento?"
          message={`¿Estás seguro de que quieres eliminar "${formData.title}"? Esta acción no se puede deshacer.`}
          confirmText="Sí, eliminar"
          cancelText="Cancelar"
          type="danger"
        />
      </div>
    </div>
  )
}

export default EventModal
