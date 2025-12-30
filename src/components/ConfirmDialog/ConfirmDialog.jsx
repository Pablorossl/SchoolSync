import { useEffect } from 'react'
import PropTypes from 'prop-types'
import './ConfirmDialog.css'

/**
 * Componente de diálogo de confirmación
 * 
 * @param {boolean} isOpen - Si el diálogo está abierto
 * @param {function} onClose - Callback para cerrar el diálogo
 * @param {function} onConfirm - Callback cuando se confirma la acción
 * @param {string} title - Título del diálogo
 * @param {string} message - Mensaje de confirmación
 * @param {string} confirmText - Texto del botón de confirmar (default: "Confirmar")
 * @param {string} cancelText - Texto del botón de cancelar (default: "Cancelar")
 * @param {string} type - Tipo de diálogo: "danger", "warning", "info" (default: "danger")
 */
const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = '¿Estás seguro?',
  message = '¿Quieres continuar con esta acción?',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'danger' // danger, warning, info
}) => {
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <div className="confirm-dialog-overlay" onClick={onClose}>
      <div 
        className="confirm-dialog-content" 
        onClick={(e) => e.stopPropagation()}
        role="alertdialog"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-message"
        aria-modal="true"
      >
        <div className={`confirm-dialog-icon confirm-dialog-icon-${type}`} aria-hidden="true">
          {type === 'danger' && '⚠️'}
          {type === 'warning' && '⚡'}
          {type === 'info' && 'ℹ️'}
        </div>
        
        <h3 id="confirm-dialog-title" className="confirm-dialog-title">
          {title}
        </h3>
        
        <p id="confirm-dialog-message" className="confirm-dialog-message">
          {message}
        </p>
        
        <div className="confirm-dialog-actions">
          <button 
            onClick={onClose} 
            className="btn-dialog btn-dialog-cancel"
            aria-label="Cancelar acción"
          >
            {cancelText}
          </button>
          <button 
            onClick={handleConfirm} 
            className={`btn-dialog btn-dialog-confirm btn-dialog-${type}`}
            aria-label="Confirmar acción"
            autoFocus
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

ConfirmDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  type: PropTypes.oneOf(['danger', 'warning', 'info']),
}

export default ConfirmDialog
