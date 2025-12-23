import { useState, useEffect } from 'react'
import './EventModal.css'

const EventModal = ({ isOpen, onClose, onSave, onDelete, event, isTeacher }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'task',
    start: '',
    end: '',
  })

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

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleChange = (e) => {
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
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
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
                {event.type === 'task' && '📝 Tarea'}
                {event.type === 'exam' && '📚 Examen'}
                {event.type === 'note' && '📌 Nota'}
                {event.type === 'event' && '🎉 Evento'}
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
              <option value="task">📝 Tarea</option>
              <option value="exam">📚 Examen</option>
              <option value="note">📌 Nota Importante</option>
              <option value="event">🎉 Evento</option>
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
              rows="3"
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
                onClick={onDelete}
                className="btn-danger"
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
      </div>
    </div>
  )
}

export default EventModal
