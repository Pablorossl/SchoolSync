import { useToast } from '../context/ToastContext'
import { logger } from './logger'

/**
 * Helper para manejar operaciones asíncronas con toast y logging
 * Reduce duplicación de try/catch/toast en toda la aplicación
 * 
 * @param {Function} operation - Función asíncrona a ejecutar
 * @param {Object} messages - Mensajes de éxito y error
 * @param {string} messages.success - Mensaje de éxito
 * @param {string} messages.error - Mensaje de error
 * @param {string} messages.loading - Mensaje mientras carga (opcional)
 * @returns {Promise} - Resultado de la operación
 */
export const withErrorHandling = async (operation, messages = {}) => {
  const {
    success = null,
    error = 'Ha ocurrido un error',
    loading = null
  } = messages

  try {
    const result = await operation()
    
    if (success) {
      // El toast debe ser llamado desde el componente que usa useToast
      // Esta función solo retorna el resultado y el estado
      return { success: true, data: result, message: success }
    }
    
    return { success: true, data: result }
  } catch (err) {
    logger.error(error, err)
    return { success: false, error: err, message: error }
  }
}

/**
 * Hook personalizado para ejecutar operaciones con manejo de errores
 * Combina withErrorHandling con useToast
 */
export const useAsyncOperation = () => {
  const toast = useToast()

  return async (operation, errorMessage) => {
    try {
      const result = await operation()
      return result
    } catch (err) {
      logger.error(errorMessage || 'Error en operación', err)
      if (errorMessage) {
        toast.error(errorMessage)
      }
      return null
    }
  }
}

/**
 * Validador genérico de campos de formulario
 */
export const validateForm = (data, rules) => {
  const errors = {}
  
  Object.keys(rules).forEach(field => {
    const rule = rules[field]
    const value = data[field]
    
    if (rule.required && (!value || value.trim() === '')) {
      errors[field] = rule.message || `${field} es requerido`
    }
    
    if (rule.minLength && value && value.length < rule.minLength) {
      errors[field] = `Debe tener al menos ${rule.minLength} caracteres`
    }
    
    if (rule.maxLength && value && value.length > rule.maxLength) {
      errors[field] = `No puede exceder ${rule.maxLength} caracteres`
    }
    
    if (rule.pattern && value && !rule.pattern.test(value)) {
      errors[field] = rule.message || 'Formato inválido'
    }
  })
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

/**
 * Debounce function para optimizar búsquedas y eventos
 */
export const debounce = (func, delay = 300) => {
  let timeoutId
  
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

/**
 * Throttle function para limitar ejecuciones frecuentes
 */
export const throttle = (func, limit = 300) => {
  let inThrottle
  
  return (...args) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

/**
 * Formatear fecha de manera consistente
 */
export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  }
  
  return new Date(date).toLocaleDateString('es-ES', defaultOptions)
}

/**
 * Formatear tiempo relativo (hace X minutos)
 */
export const formatTimeAgo = (date) => {
  const now = new Date()
  const past = new Date(date)
  const diffMs = now - past
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Ahora'
  if (diffMins < 60) return `Hace ${diffMins} min`
  if (diffHours < 24) return `Hace ${diffHours}h`
  if (diffDays < 7) return `Hace ${diffDays}d`
  
  return past.toLocaleDateString('es-ES')
}

/**
 * Generar ID único simple
 */
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Truncar texto con ellipsis
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

/**
 * Capitalizar primera letra
 */
export const capitalize = (text) => {
  if (!text) return ''
  return text.charAt(0).toUpperCase() + text.slice(1)
}

/**
 * Clasificar por campo
 */
export const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ')
}

export default {
  withErrorHandling,
  useAsyncOperation,
  validateForm,
  debounce,
  throttle,
  formatDate,
  formatTimeAgo,
  generateId,
  truncateText,
  capitalize,
  classNames,
}
