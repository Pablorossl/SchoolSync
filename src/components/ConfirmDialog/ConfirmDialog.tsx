import { useEffect, type MouseEvent, type KeyboardEvent } from 'react'
import './ConfirmDialog.css'

/**
 * Tipos de diálogo disponibles
 */
type DialogType = 'danger' | 'warning' | 'info'

/**
 * Props del componente ConfirmDialog
 */
interface ConfirmDialogProps {
  /** Si el diálogo está abierto */
  isOpen: boolean
  /** Callback para cerrar el diálogo */
  onClose: () => void
  /** Callback cuando se confirma la acción */
  onConfirm: () => void
  /** Título del diálogo */
  title?: string
  /** Mensaje de confirmación */
  message?: string
  /** Texto del botón de confirmar */
  confirmText?: string
  /** Texto del botón de cancelar */
  cancelText?: string
  /** Tipo de diálogo */
  type?: DialogType
}

/**
 * Componente de diálogo de confirmación
 */
const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = '¿Estás seguro?',
  message = '¿Quieres continuar con esta acción?',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'danger'
}: ConfirmDialogProps) => {
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: globalThis.KeyboardEvent) => {
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
        onClick={(e: MouseEvent) => e.stopPropagation()}
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

export default ConfirmDialog
