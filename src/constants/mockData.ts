/**
 * Mock Data - Datos de prueba centralizados
 * 
 * Este archivo centraliza todos los datos mock/dummy usados en desarrollo.
 * Cuando el backend esté listo, estos datos serán reemplazados por
 * llamadas reales a la API.
 * 
 * IMPORTANTE: Mantén este archivo sincronizado. Es la única fuente
 * de verdad para datos de desarrollo.
 */

import { USER_ROLES, type UserRole } from './ui'

/**
 * Tipo de usuario mock
 */
export interface MockUser {
  id: string
  email: string
  password?: string  // Solo para usuarios con login
  role: UserRole
  name: string
  subject?: string   // Para profesores
  relation?: string  // Para padres
}

/**
 * Usuarios de prueba para autenticación y mensajería
 * 
 * NOTA: IDs son strings para consistencia con la API real.
 * Todos los servicios deben usar estos usuarios.
 */
export const MOCK_USERS: MockUser[] = [
  // Usuarios principales con credenciales de login
  {
    id: '1',
    email: 'profesor@schoolsync.com',
    password: 'profesor123', // Solo para authService
    role: USER_ROLES.TEACHER,
    name: 'James Kennedy',
  },
  {
    id: '2',
    email: 'padre@schoolsync.com',
    password: 'padre123', // Solo para authService
    role: USER_ROLES.PARENT,
    name: 'Pablo Rosales',
  },
  
  // Usuarios adicionales para mensajería (sin login)
  {
    id: 'teacher_2',
    email: 'ana.sanchez@schoolsync.com',
    role: USER_ROLES.TEACHER,
    name: 'Prof. Ana Sánchez',
    subject: 'Lengua',
  },
  {
    id: 'teacher_3',
    email: 'luis.fernandez@schoolsync.com',
    role: USER_ROLES.TEACHER,
    name: 'Prof. Luis Fernández',
    subject: 'Ciencias',
  },
  {
    id: 'parent_3',
    email: 'carmen.ruiz@schoolsync.com',
    role: USER_ROLES.PARENT,
    name: 'Carmen Ruiz',
    relation: 'Madre de Luis',
  },
  {
    id: 'parent_4',
    email: 'maria.garcia@schoolsync.com',
    role: USER_ROLES.PARENT,
    name: 'María García',
    relation: 'Madre de Juan',
  },
]

/**
 * Obtener usuarios que pueden hacer login
 */
export const getLoginUsers = (): MockUser[] => {
  return MOCK_USERS.filter(user => user.password)
}

/**
 * Obtener todos los usuarios disponibles (para selección en mensajería)
 */
export const getAllUsers = (): MockUser[] => {
  return MOCK_USERS
}

/**
 * Buscar usuario por ID
 */
export const getUserById = (id: string | number): MockUser | undefined => {
  return MOCK_USERS.find(user => user.id === String(id))
}

/**
 * Buscar usuario por email
 */
export const getUserByEmail = (email: string): MockUser | undefined => {
  return MOCK_USERS.find(user => user.email === email)
}

/**
 * Títulos de eventos de ejemplo (para desarrollo)
 * TODO: BACKEND - Esto vendrá del endpoint /events
 */
export const MOCK_EVENT_TITLES: Record<string, string> = {
  event_1: '📝 Entrega trabajo matemáticas',
  event_2: '📚 Examen de lengua',
  event_3: '🎨 Excursión al museo',
}

export default {
  MOCK_USERS,
  getLoginUsers,
  getAllUsers,
  getUserById,
  getUserByEmail,
  MOCK_EVENT_TITLES,
}
