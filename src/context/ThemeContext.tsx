import { createContext, useState, useContext, useEffect, type ReactNode } from 'react'
import { STORAGE_KEYS } from '../constants/ui'

/**
 * Tipos de tema disponibles
 */
export type Theme = 'light' | 'dark'

/**
 * Tipo del contexto de tema
 */
interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  isDark: boolean
}

/**
 * Props del ThemeProvider
 */
interface ThemeProviderProps {
  children: ReactNode
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Cargar tema guardado o usar preferencia del sistema
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME)
    if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme
    
    // Detectar preferencia del sistema
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark'
    }
    return 'light'
  })

  useEffect(() => {
    // Aplicar tema al document root
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(STORAGE_KEYS.THEME, theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  const value: ThemeContextType = {
    theme,
    toggleTheme,
    isDark: theme === 'dark',
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme debe ser usado dentro de ThemeProvider')
  }
  return context
}
