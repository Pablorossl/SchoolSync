import './LoadingSpinner.css'

/**
 * Tamaños disponibles para el spinner
 */
type SpinnerSize = 'small' | 'medium' | 'large'

/**
 * Props del componente LoadingSpinner
 */
interface LoadingSpinnerProps {
  /** Tamaño del spinner */
  size?: SpinnerSize
  /** Mensaje opcional que se muestra debajo del spinner */
  message?: string
  /** Si se debe mostrar en pantalla completa */
  fullScreen?: boolean
}

/**
 * Componente de spinner de carga
 */
const LoadingSpinner = ({ 
  size = 'medium', 
  message = '', 
  fullScreen = false 
}: LoadingSpinnerProps) => {
  const containerClass = fullScreen 
    ? 'loading-spinner-fullscreen' 
    : 'loading-spinner-container'

  return (
    <div className={containerClass} role="status" aria-live="polite">
      <div
        className={`loading-spinner loading-spinner-${size}`}
        aria-hidden="true"
      >
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
      </div>

      {message && <p className="loading-message">{message}</p>}

      <span className="sr-only">Cargando...</span>
    </div>
  )
}


export default LoadingSpinner

