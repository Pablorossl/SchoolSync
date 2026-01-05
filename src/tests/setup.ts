// Test setup - ejecutado antes de cada test
import { beforeEach, afterEach } from 'vitest'

// Mock básico de localStorage
const localStorageMock = {
  store: {},
  getItem(key) {
    return this.store[key] || null
  },
  setItem(key, value) {
    this.store[key] = String(value)
  },
  removeItem(key) {
    delete this.store[key]
  },
  clear() {
    this.store = {}
  },
}

global.localStorage = localStorageMock

// Limpiar localStorage antes de cada test
beforeEach(() => {
  localStorage.clear()
})

// Limpiar después de cada test
afterEach(() => {
  localStorage.clear()
})
