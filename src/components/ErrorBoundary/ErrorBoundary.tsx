import { Component, type ReactNode, type ErrorInfo } from 'react'
import logger from '../../utils/logger'
import './ErrorBoundary.css'

/**
 * Props del ErrorBoundary
 */
interface ErrorBoundaryProps {
  children: ReactNode
}

/**
 * State del ErrorBoundary
 */
interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

/**
 * Error Boundary Component
 * 
 * Captura errores en componentes hijos y muestra UI de fallback
 * en lugar de crashear toda la aplicación.
 * 
 * Uso:
 * <ErrorBoundary>
 *   <MiComponente />
 * </ErrorBoundary>
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(_error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log del error
    logger.error('Error capturado por ErrorBoundary', {
      error,
      errorInfo,
      componentStack: errorInfo.componentStack
    })

    this.setState({
      error,
      errorInfo
    })

    // TODO: Enviar a servicio de monitoreo en producción
    // Ejemplo: Sentry.captureException(error, { extra: errorInfo })
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    })
    
    // Recargar la página para resetear el estado
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <div className="error-boundary-icon">⚠️</div>
            <h1 className="error-boundary-title">
              Algo salió mal
            </h1>
            <p className="error-boundary-message">
              Lo sentimos, ha ocurrido un error inesperado. 
              El equipo de desarrollo ha sido notificado.
            </p>
            
            {import.meta.env.DEV && this.state.error && (
              <details className="error-boundary-details">
                <summary>Detalles del error (solo en desarrollo)</summary>
                <pre className="error-boundary-stack">
                  <strong>Error:</strong> {this.state.error.toString()}
                  {this.state.errorInfo && (
                    <>
                      {'\n\n'}
                      <strong>Stack:</strong>
                      {this.state.errorInfo.componentStack}
                    </>
                  )}
                </pre>
              </details>
            )}

            <div className="error-boundary-actions">
              <button 
                onClick={this.handleReset}
                className="btn-error-reset"
              >
                🏠 Volver al inicio
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="btn-error-reload"
              >
                🔄 Recargar página
              </button>
            </div>

            <p className="error-boundary-help">
              Si el problema persiste, contacta al soporte técnico
            </p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
