/**
 * Logger Wrapper
 * 
 * Proporciona logging controlado según el entorno.
 * En desarrollo: muestra en consola
 * En producción: puede enviar a servicio de monitoreo (Sentry, etc.)
 */

const isDevelopment = import.meta.env.DEV

export interface Logger {
  info: (message: string, ...args: any[]) => void
  error: (message: string, error?: any) => void
  warn: (message: string, ...args: any[]) => void
  debug: (message: string, ...args: any[]) => void
  success: (message: string, ...args: any[]) => void
}

export const logger: Logger = {
  /**
   * Log de información general
   */
  info: (message: string, ...args: any[]): void => {
    if (isDevelopment) {
      console.info(`ℹ️ [INFO] ${message}`, ...args)
    }
  },

  /**
   * Log de errores
   */
  error: (message: string, error?: any): void => {
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
  warn: (message: string, ...args: any[]): void => {
    if (isDevelopment) {
      console.warn(`⚠️ [WARN] ${message}`, ...args)
    }
  },

  /**
   * Log de debug (solo en desarrollo)
   */
  debug: (message: string, ...args: any[]): void => {
    if (isDevelopment) {
      console.debug(`🐛 [DEBUG] ${message}`, ...args)
    }
  },

  /**
   * Log de éxito
   */
  success: (message: string, ...args: any[]): void => {
    if (isDevelopment) {
      console.log(`✅ [SUCCESS] ${message}`, ...args)
    }
  }
}

export default logger
