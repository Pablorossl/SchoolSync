// API Client configurado para futuras llamadas al backend
// TODO: BACKEND - Este archivo está listo para usar cuando tengas el backend

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

/**
 * Cliente HTTP configurado con interceptores
 * Maneja automáticamente tokens de autenticación y errores
 */
class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL
  }

  /**
   * Obtener headers con token de autenticación
   */
  getHeaders() {
    const headers = {
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
  async handleResponse(response) {
    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: 'Error en la petición'
      }))
      
      // Si el token expiró, redirigir al login
      if (response.status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('schoolsync_user')
        window.location.href = '/login'
      }
      
      throw new Error(error.message || `HTTP Error ${response.status}`)
    }

    return response.json()
  }

  /**
   * GET request
   * 
   * Ejemplo de uso:
   * const users = await apiClient.get('/users')
   * const user = await apiClient.get('/users/123')
   */
  async get(endpoint, options = {}) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'GET',
      headers: this.getHeaders(),
      ...options,
    })
    return this.handleResponse(response)
  }

  /**
   * POST request
   * 
   * Ejemplo de uso:
   * const newUser = await apiClient.post('/users', { name: 'Juan', email: 'juan@example.com' })
   */
  async post(endpoint, data, options = {}) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
      ...options,
    })
    return this.handleResponse(response)
  }

  /**
   * PUT request
   * 
   * Ejemplo de uso:
   * const updated = await apiClient.put('/users/123', { name: 'Juan Actualizado' })
   */
  async put(endpoint, data, options = {}) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
      ...options,
    })
    return this.handleResponse(response)
  }

  /**
   * DELETE request
   * 
   * Ejemplo de uso:
   * await apiClient.delete('/users/123')
   */
  async delete(endpoint, options = {}) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
      ...options,
    })
    return this.handleResponse(response)
  }
}

// Instancia única del cliente API
const apiClient = new ApiClient(API_URL)

export default apiClient

/**
 * GUÍA DE USO CON BACKEND:
 * 
 * 1. En authService.js:
 *    import apiClient from './apiClient'
 *    const response = await apiClient.post('/auth/login', { email, password })
 * 
 * 2. En calendarService.js:
 *    import apiClient from './apiClient'
 *    const events = await apiClient.get('/events')
 *    const newEvent = await apiClient.post('/events', eventData)
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
