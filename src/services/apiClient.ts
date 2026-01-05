// API Client configurado para futuras llamadas al backend
// TODO: BACKEND - Este archivo está listo para usar cuando tengas el backend

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

/**
 * Opciones para las peticiones HTTP
 */
export interface RequestOptions extends RequestInit {
  headers?: Record<string, string>
}

/**
 * Respuesta de error de la API
 */
export interface ApiError {
  message: string
  status?: number
}

/**
 * Cliente HTTP configurado con interceptores
 * Maneja automáticamente tokens de autenticación y errores
 */
class ApiClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  /**
   * Obtener headers con token de autenticación
   */
  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    // TODO: BACKEND - Cuando implementes JWT, descomenta esto:
    // const token = localStorage.getItem('token')
    // if (token) {
    //   headers['Authorization'] = `Bearer ${token}`
    // }

    return headers
  }

  /**
   * Manejar respuestas HTTP
   */
  private async handleResponse<T = any>(response: Response): Promise<T> {
    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        message: 'Error en la petición'
      }))
      
      // Si el token expiró, redirigir al login
      if (response.status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('schoolsync_user')
        window.location.href = '/login'
      }
      
      const apiError = new Error(error.message || `HTTP Error ${response.status}`) as Error & { status: number }
      apiError.status = response.status
      throw apiError
    }

    return response.json()
  }

  /**
   * GET request
   * 
   * Ejemplo de uso:
   * const users = await apiClient.get<User[]>('/users')
   * const user = await apiClient.get<User>('/users/123')
   */
  async get<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'GET',
      headers: this.getHeaders(),
      ...options,
    })
    return this.handleResponse<T>(response)
  }

  /**
   * POST request
   * 
   * Ejemplo de uso:
   * const newUser = await apiClient.post<User>('/users', { name: 'Juan', email: 'juan@example.com' })
   */
  async post<T = any>(endpoint: string, data?: any, options: RequestOptions = {}): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
      ...options,
    })
    return this.handleResponse<T>(response)
  }

  /**
   * PUT request
   * 
   * Ejemplo de uso:
   * const updated = await apiClient.put<User>('/users/123', { name: 'Juan Actualizado' })
   */
  async put<T = any>(endpoint: string, data?: any, options: RequestOptions = {}): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
      ...options,
    })
    return this.handleResponse<T>(response)
  }

  /**
   * DELETE request
   * 
   * Ejemplo de uso:
   * await apiClient.delete('/users/123')
   */
  async delete<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
      ...options,
    })
    return this.handleResponse<T>(response)
  }
}

// Instancia única del cliente API
const apiClient = new ApiClient(API_URL)

export default apiClient

/**
 * GUÍA DE USO CON BACKEND:
 * 
 * 1. En authService.ts:
 *    import apiClient from './apiClient'
 *    const response = await apiClient.post<AuthResponse>('/auth/login', { email, password })
 * 
 * 2. En calendarService.ts:
 *    import apiClient from './apiClient'
 *    const events = await apiClient.get<Event[]>('/events')
 *    const newEvent = await apiClient.post<Event>('/events', eventData)
 * 
 * 3. Configurar variables de entorno (.env):
 *    VITE_API_URL=http://localhost:5000/api
 * 
 * 4. El cliente maneja automáticamente:
 *    - Headers de autenticación
 *    - Errores HTTP
 *    - Tokens expirados
 *    - Serialización JSON
 */
