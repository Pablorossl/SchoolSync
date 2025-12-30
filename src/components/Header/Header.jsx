import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { useToast } from '../../context/ToastContext'
import Tooltip from '../Tooltip/Tooltip'
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog'
import './Header.css'

const Header = () => {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const toast = useToast()
  const navigate = useNavigate()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const handleLogout = () => {
    logout()
    toast.info('Sesión cerrada correctamente')
    navigate('/login')
  }

  return (
    <header className="header" role="banner">
      <div className="header-content">
        <div className="header-logo">
          <h2>SchoolSync</h2>
        </div>

        <div className="header-actions">
          <Tooltip content={theme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'} position="bottom">
            <button 
              onClick={toggleTheme} 
              className="btn-theme"
              aria-label={theme === 'dark' ? 'Activar tema claro' : 'Activar tema oscuro'}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </Tooltip>

          <div className="header-user">
            <span className="user-name">{user?.name}</span>
            <Tooltip content="Cerrar sesión" position="bottom">
              <button 
                onClick={() => setShowLogoutConfirm(true)} 
                className="btn-logout"
                aria-label="Cerrar sesión"
              >
                Cerrar Sesión
              </button>
            </Tooltip>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        title="¿Cerrar sesión?"
        message="¿Estás seguro de que quieres cerrar tu sesión?"
        confirmText="Sí, cerrar sesión"
        cancelText="Cancelar"
        type="warning"
      />
    </header>
  )
}

export default Header
