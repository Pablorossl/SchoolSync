import PropTypes from 'prop-types'
import './LoadingSpinner.css'

/**
 * Componente de spinner de carga
 * 
 * @param {string} size - Tamaño del spinner: "small", "medium", "large"
 * @param {string} message - Mensaje opcional que se muestra debajo del spinner
 * @param {boolean} fullScreen - Si se debe mostrar en pantalla completa
 */
const LoadingSpinner = ({ 
  size = 'medium', 
  message = '', 
  fullScreen = false 
}) => {
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

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  message: PropTypes.string,
  fullScreen: PropTypes.bool,
}

export default LoadingSpinner

