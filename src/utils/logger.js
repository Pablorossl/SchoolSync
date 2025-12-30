/**
 * Logger Wrapper
 * 
 * Proporciona logging controlado según el entorno.
 * En desarrollo: muestra en consola
 * En producción: puede enviar a servicio de monitoreo (Sentry, etc.)
 */

const isDevelopment = import.meta.env.DEV

export const logger = {
  /**
   * Log de información general
   */
  info: (message, ...args) => {
    if (isDevelopment) {
      console.info(`ℹ️ [INFO] ${message}`, ...args)
    }
  },

  /**
   * Log de errores
   */
  error: (message, error) => {
    if (isDevelopment) {
      console.error(`❌ [ERROR] ${message}`, error)
    } else {
      // TODO: Enviar a servicio de monitoreo en producción
      // Ejemplo: Sentry.captureException(error, { message })
    }
  },

  /**
   * Log de advertencias
   */
  warn: (message, ...args) => {
    if (isDevelopment) {
      console.warn(`⚠️ [WARN] ${message}`, ...args)
    }
  },

  /**
   * Log de debug (solo en desarrollo)
   */
  debug: (message, ...args) => {
    if (isDevelopment) {
      console.debug(`🐛 [DEBUG] ${message}`, ...args)
    }
  },

  /**
   * Log de éxito
   */
  success: (message, ...args) => {
    if (isDevelopment) {
      console.log(`✅ [SUCCESS] ${message}`, ...args)
    }
  }
}

export default logger
