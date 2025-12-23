import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import * as authService from '../../services/authService'
import './Login.css'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const userData = await authService.login(email, password)
      login(userData)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  const fillTeacherDemo = () => {
    setEmail('profesor@schoolsync.com')
    setPassword('profesor123')
  }

  const fillParentDemo = () => {
    setEmail('padre@schoolsync.com')
    setPassword('padre123')
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>SchoolSync</h1>
          <p>Gestión Escolar Moderna</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="demo-section">
          <p className="demo-title">Cuentas de demostración:</p>
          <div className="demo-buttons">
            <button onClick={fillTeacherDemo} className="btn-demo">
              👨‍🏫 Profesor
            </button>
            <button onClick={fillParentDemo} className="btn-demo">
              👨‍👩‍👧 Padre/Madre
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
