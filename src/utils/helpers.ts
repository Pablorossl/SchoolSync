import { useToast } from '@context/ToastContext'
import { logger } from './logger'

/**
 * Tipo para el resultado de operaciones con manejo de errores
 */
export interface AsyncOperationResult<T = any> {
  success: boolean
  data?: T
  error?: Error
  message?: string
}

/**
 * Mensajes para operaciones asíncronas
 */
export interface AsyncMessages {
  success?: string | null
  error?: string
  loading?: string | null
}

/**
 * Regla de validación para formularios
 */
export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  message?: string
}

/**
 * Resultado de validación de formulario
 */
export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string>
}

/**
 * Helper para manejar operaciones asíncronas con toast y logging
 * Reduce duplicación de try/catch/toast en toda la aplicación
 */
export const withErrorHandling = async <T = any>(
  operation: () => Promise<T>,
  messages: AsyncMessages = {}
): Promise<AsyncOperationResult<T>> => {
  const {
    success = null,
    error = 'Ha ocurrido un error',
  } = messages

  try {
    const result = await operation()
    
    if (success) {
      return { success: true, data: result, message: success }
    }
    
    return { success: true, data: result }
  } catch (err) {
    logger.error(error, err)
    return { 
      success: false, 
      error: err instanceof Error ? err : new Error(String(err)), 
      message: error 
    }
  }
}

/**
 * Hook personalizado para ejecutar operaciones con manejo de errores
 * Combina withErrorHandling con useToast
 */
export const useAsyncOperation = () => {
  const toast: any = useToast() // TODO: Fix cuando ToastContext esté en TS

  return async <T = any>(
    operation: () => Promise<T>,
    errorMessage?: string
  ): Promise<T | null> => {
    try {
      const result = await operation()
      return result
    } catch (err) {
      logger.error(errorMessage || 'Error en operación', err)
      if (errorMessage && toast) {
        toast.error(errorMessage)
      }
      return null
    }
  }
}

/**
 * Validador genérico de campos de formulario
 */
export const validateForm = (
  data: Record<string, any>,
  rules: Record<string, ValidationRule>
): ValidationResult => {
  const errors: Record<string, string> = {}
  
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
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number = 300
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

/**
 * Throttle function para limitar ejecuciones frecuentes
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number = 300
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean
  
  return (...args: Parameters<T>) => {
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
export const formatDate = (
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = {}
): string => {
  const defaultOptions: Intl.DateTimeFormatOptions = {
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
export const formatTimeAgo = (date: Date | string | number): string => {
  const now = new Date()
  const past = new Date(date)
  const diffMs = now.getTime() - past.getTime()
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
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Truncar texto con ellipsis
 */
export const truncateText = (text: string, maxLength: number = 50): string => {
  if (!text || text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

/**
 * Capitalizar primera letra
 */
export const capitalize = (text: string): string => {
  if (!text) return ''
  return text.charAt(0).toUpperCase() + text.slice(1)
}

/**
 * Combinar clases CSS de manera segura
 */
export const classNames = (...classes: (string | boolean | undefined | null)[]): string => {
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
