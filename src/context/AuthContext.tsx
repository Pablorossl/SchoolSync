import { createContext, useState, useContext, useEffect, type ReactNode } from 'react'
import * as authService from '@services/authService'
import type { UserWithoutPassword } from '@services/authService'
import logger from '@utils/logger'
import { STORAGE_KEYS } from '@constants/ui'

/**
 * Tipo del contexto de autenticación
 */
interface AuthContextType {
  user: UserWithoutPassword | null
  login: (userData: UserWithoutPassword) => void
  logout: () => void
  loading: boolean
  isAuthenticated: boolean
}

/**
 * Props del AuthProvider
 */
interface AuthProviderProps {
  children: ReactNode
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserWithoutPassword | null>(null)
  const [loading, setLoading] = useState(true)

  // Inicializar el usuario: usamos authService.verifyToken() para
  // sincronizar el usuario guardado en localStorage con los datos
  // de desarrollo (MOCK_USERS centralizados). Esto permite que, al cambiar los
  // nombres en `mockData.js`, la UI se actualice automáticamente.
  useEffect(() => {
    const init = async () => {
      try {
        const verified = await authService.verifyToken()
        if (verified) setUser(verified)
      } catch (err) {
        logger.error('Error verificando usuario:', err)
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [])

  const login = (userData: UserWithoutPassword) => {
    setUser(userData)
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEYS.USER)
    // TODO: BACKEND - Llamar al endpoint de logout para invalidar token
    // await apiClient.post('/auth/logout')
  }

  const value: AuthContextType = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider')
  }
  return context
}
