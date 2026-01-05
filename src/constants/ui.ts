/**
 * Constantes de UI/UX
 * 
 * Centraliza valores mágicos usados en toda la aplicación
 * para facilitar mantenimiento y consistencia.
 */

// ⏱️ Duraciones y Delays
export const DURATION = {
  TOAST: 3000,           // Duración de notificaciones toast (ms)
  TOOLTIP_DELAY: 300,    // Delay antes de mostrar tooltip (ms)
  ANIMATION_SHORT: 200,  // Animaciones cortas (ms)
  ANIMATION_MEDIUM: 300, // Animaciones medianas (ms)
  ANIMATION_LONG: 600,   // Animaciones largas (ms)
} as const

// 🎨 Animaciones CSS
export const ANIMATION = {
  DURATION: {
    SHORT: '0.2s',
    MEDIUM: '0.3s',
    LONG: '0.6s',
  },
  EASING: {
    DEFAULT: 'ease',
    IN: 'ease-in',
    OUT: 'ease-out',
    IN_OUT: 'ease-in-out',
    CUBIC: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  }
} as const

// 📏 Breakpoints Responsive
export const BREAKPOINTS = {
  MOBILE: 360,
  MOBILE_LARGE: 480,
  TABLET: 768,
  DESKTOP: 1024,
  DESKTOP_LARGE: 1440,
  DESKTOP_XL: 1920,
} as const

// 🎨 Z-Index Layers
export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
  TOAST: 1080,
  LOADING_FULLSCREEN: 9999,
} as const

// 📦 Tamaños de Componentes
export const SIZE = {
  SPINNER: {
    SMALL: 30,
    MEDIUM: 50,
    LARGE: 80,
  },
  BUTTON: {
    SMALL: 32,
    MEDIUM: 40,
    LARGE: 48,
  },
  ICON: {
    SMALL: 16,
    MEDIUM: 24,
    LARGE: 32,
  }
} as const

// 🔑 LocalStorage Keys
export const STORAGE_KEYS = {
  USER: 'schoolsync_user',
  THEME: 'schoolsync_theme',
  TUTORIAL_COMPLETED: 'schoolsync_tutorial_completed',
  CONVERSATIONS: 'schoolsync_conversations',
  MESSAGES: 'schoolsync_messages',
  EVENTS: 'schoolsync_events',
} as const

// 🎯 Tipos de Eventos
export const EVENT_TYPES = {
  TASK: 'task',
  EXAM: 'exam',
  NOTE: 'note',
  EVENT: 'event',
} as const

// 🎨 Colores de Eventos
export const EVENT_COLORS = {
  [EVENT_TYPES.TASK]: '#ef4444',   // Rojo
  [EVENT_TYPES.EXAM]: '#f59e0b',   // Naranja
  [EVENT_TYPES.NOTE]: '#3b82f6',   // Azul
  [EVENT_TYPES.EVENT]: '#10b981',  // Verde
} as const

// 👥 Roles de Usuario
export const USER_ROLES = {
  TEACHER: 'teacher',
  PARENT: 'parent',
} as const

// 📱 Media Queries
export const MEDIA_QUERIES = {
  MOBILE: `(max-width: ${BREAKPOINTS.MOBILE_LARGE}px)`,
  TABLET: `(max-width: ${BREAKPOINTS.TABLET}px)`,
  DESKTOP: `(min-width: ${BREAKPOINTS.DESKTOP}px)`,
  MOBILE_ONLY: `(max-width: ${BREAKPOINTS.TABLET - 1}px)`,
  TABLET_ONLY: `(min-width: ${BREAKPOINTS.TABLET}px) and (max-width: ${BREAKPOINTS.DESKTOP - 1}px)`,
} as const

// ⚙️ Configuración de API
export const API_CONFIG = {
  TIMEOUT: 30000, // 30 segundos
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 segundo
} as const

// 📘 Types
export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES]
export type EventType = typeof EVENT_TYPES[keyof typeof EVENT_TYPES]
export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS]

export default {
  DURATION,
  ANIMATION,
  BREAKPOINTS,
  Z_INDEX,
  SIZE,
  STORAGE_KEYS,
  EVENT_TYPES,
  EVENT_COLORS,
  USER_ROLES,
  MEDIA_QUERIES,
  API_CONFIG,
}
