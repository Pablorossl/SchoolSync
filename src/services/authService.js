// Servicio de autenticación
// TODO: BACKEND - Reemplazar con llamadas HTTP reales

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Usuarios dummy para desarrollo (remover cuando haya backend)
const DUMMY_USERS = [
  {
    id: 1,
    email: 'profesor@schoolsync.com',
    password: 'profesor123',
    role: 'teacher',
    name: 'James Kennedy',
  },
  {
    id: 2,
    email: 'padre@schoolsync.com',
    password: 'padre123',
    role: 'parent',
    name: 'Pablo Rosales',
  },
]

/**
 * Login de usuario (actualmente dummy)
 * TODO: BACKEND - Implementar llamada real:
 * 
 * const response = await fetch(`${API_URL}/auth/login`, {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({ email, password })
 * })
 * const data = await response.json()
 * localStorage.setItem('token', data.token)
 * return data.user
 */
export const login = async (email, password) => {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 500))

  const user = DUMMY_USERS.find(
    u => u.email === email && u.password === password
  )

  if (!user) {
    throw new Error('Credenciales inválidas')
  }

  // Remover password antes de devolver
  const { password: _, ...userWithoutPassword } = user
  return userWithoutPassword
}

/**
 * Registro de nuevo usuario
 * TODO: BACKEND - Implementar:
 * 
 * const response = await fetch(`${API_URL}/auth/register`, {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({ email, password, name, role })
 * })
 */
export const register = async (userData) => {
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Por ahora solo retornamos los datos
  return {
    id: Date.now(),
    ...userData,
  }
}

/**
 * Verificar token de usuario
 * TODO: BACKEND - Implementar:
 * 
 * const token = localStorage.getItem('token')
 * const response = await fetch(`${API_URL}/auth/verify`, {
 *   headers: { 'Authorization': `Bearer ${token}` }
 * })
 */
export const verifyToken = async () => {
  const userStr = localStorage.getItem('schoolsync_user')
  if (!userStr) return null
  
  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

export default {
  login,
  register,
  verifyToken,
}
