import { createContext, useState, useContext, useEffect } from 'react'
import * as authService from '../services/authService'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Inicializar el usuario: usamos authService.verifyToken() para
  // sincronizar el usuario guardado en localStorage con los datos
  // de desarrollo (DUMMY_USERS). Esto permite que, al cambiar los
  // nombres en `authService`, la UI se actualice automáticamente.
  useEffect(() => {
    const init = async () => {
      try {
        const verified = await authService.verifyToken()
        if (verified) setUser(verified)
      } catch (err) {
        console.error('Error verificando usuario:', err)
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [])

  const login = (userData) => {
    setUser(userData)
    localStorage.setItem('schoolsync_user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('schoolsync_user')
    // TODO: BACKEND - Llamar al endpoint de logout para invalidar token
    // await apiClient.post('/auth/logout')
  }

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider')
  }
  return context
}
